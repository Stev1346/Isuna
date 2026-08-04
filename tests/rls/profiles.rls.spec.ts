import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const url = process.env.PUBLIC_SUPABASE_URL;
const anonKey = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const configured = Boolean(url && anonKey && serviceKey);

describe.skipIf(!configured)('profiles RLS', () => {
    let admin: SupabaseClient;
    let userA: SupabaseClient;
    let userB: SupabaseClient;
    let idA: string;
    let idB: string;
    idA = '';
    idB = '';

    beforeAll(async() => {
        admin = createClient(url!, serviceKey!, {
            auth: {autoRefreshToken: false, persistSession: false}
        });

        const password = 'Password1';
        const emailA = `rls-a-${Date.now()}@example.com`;
        const emailB = `rls-b-${Date.now()}@example.com`;

        const createdA = await admin.auth.admin.createUser({
            email: emailA,
            password,
            email_confirm: true
        });
        const createdB = await admin.auth.admin.createUser({
            email: emailB,
            password,
            email_confirm: true
        });
        if(createdA.error || !createdA.data.user) throw createdA.error;
        if(createdB.error || !createdB.data.user) throw createdB.error;
        idA = createdA.data.user.id;
        idB = createdB.data.user.id;

        userA = createClient(url!, anonKey!, {
            auth: {autoRefreshToken: false, persistSession: false}
        });
        userB = createClient(url!, anonKey!, {
            auth: {autoRefreshToken: false, persistSession: false}
        });
        const signA = await userA.auth.signInWithPassword({email: emailA, password});
        const signB = await userB.auth.signInWithPassword({email: emailB, password});
        if(signA.error) throw signA.error;
        if(signB.error) throw signB.error;
    });

    afterAll(async () => {
        if(idA) await admin.auth.admin.deleteUser(idA);
        if(idB) await admin.auth.admin.deleteUser(idB);
    });

    it('lets a user read their own profile (trigger-created)', async() => {
        const {data, error} = await userA
            .from('profiles')
            .select('user_id, locale, timezone')
            .eq('user_id', idA)
            .maybeSingle();
        expect(error).toBeNull();
        expect(data?.user_id).toBe(idA);
        expect(data?.locale).toBe('en-CA');
        expect(data?.timezone).toBe('America/Edmonton');
    });

    it('lets a user update their own profile', async () => {
        const {data, error} = await userA
            .from('profiles')
            .update({display_name: 'Alpha'})
            .eq('user_id', idA)
            .select('display_name')
            .maybeSingle();
        expect(error).toBeNull();
        expect(data?.display_name).toBe('Alpha');
    });

    it('does not let a user read another profile', async () => {
        const {data, error} = await userA
            .from('profiles')
            .select('user_id')
            .eq('user_id', idB)
            .maybeSingle();
        expect(error).toBeNull();
        expect(data).toBeNull();
    });

    it('does not let a user update another profile', async () => {
        const {data, error} = await userA
            .from('profiles')
            .update({display_name: 'Hacked'})
            .eq('user_id', idB)
            .select('display_name');
        expect(error).toBeNull();
        expect(data ?? []).toHaveLength(0);

        const check = await userB
            .from('profiles')
            .select('display_name')
            .eq('user_id', idB)
            .maybeSingle();
        expect(check.data?.display_name).not.toBe('Hacked');
    });

    it('denies anon reads', async () => {
        const anon = createClient(url!, anonKey!, {
            auth: {autoRefreshToken: false, persistSession: false}
        });
        const {data, error} = await anon.from('profiles').select('user_id').limit(1);
        expect((data ?? []).length === 0 || error !== null).toBe(true);
    });

    it('denies authenticated delete', async () => {
        const {error, count} = await userA
            .from('profiles')
            .delete({count: 'exact'})
            .eq('user_id', idA);
        expect(error !== null || count === 0).toBe(true);

        const stillThere = await userA
            .from('profiles')
            .select('user_id')
            .eq('user_id', idA)
            .maybeSingle();
        expect(stillThere.data?.user_id).toBe(idA);
    });
});