// Thin service-role REST helpers — plain fetch to PostgREST, no supabase-js.
// The service-role key BYPASSES RLS; that is the whole point of this worker
// (insert leads for arbitrary reps/companies). Never expose it client-side.

function headers(env: Env): Record<string, string> {
	return {
		apikey: env.SUPABASE_SERVICE_ROLE_KEY,
		Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
		"content-type": "application/json",
	};
}

export async function sbGet<T>(env: Env, path: string): Promise<T[]> {
	const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {
		headers: headers(env),
	});
	if (!res.ok) {
		throw new Error(`Supabase GET ${path} failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
	}
	return (await res.json()) as T[];
}

export async function sbInsert<T extends Record<string, unknown>>(
	env: Env,
	table: string,
	row: T,
): Promise<{ id: string }> {
	const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}`, {
		method: "POST",
		headers: { ...headers(env), Prefer: "return=representation" },
		body: JSON.stringify(row),
	});
	if (!res.ok) {
		throw new Error(`Supabase INSERT ${table} failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
	}
	const rows = (await res.json()) as { id: string }[];
	return rows[0];
}

export async function sbUpdate(
	env: Env,
	table: string,
	id: string,
	patch: Record<string, unknown>,
): Promise<void> {
	const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
		method: "PATCH",
		headers: headers(env),
		body: JSON.stringify(patch),
	});
	if (!res.ok) {
		throw new Error(`Supabase UPDATE ${table} failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
	}
}

export async function sbRpc(env: Env, fn: string, args: Record<string, unknown>): Promise<unknown> {
	const res = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
		method: "POST",
		headers: headers(env),
		body: JSON.stringify(args),
	});
	if (!res.ok) {
		throw new Error(`Supabase RPC ${fn} failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
	}
	return res.json();
}
