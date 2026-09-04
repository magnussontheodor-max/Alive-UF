-- ===========================================================================
-- Spark UF — initial schema
--
-- Design notes
--
--  * Columns that the application filters, sorts or enforces rules on are real
--    typed columns with constraints and indexes.
--  * Rich value objects (claims, score components, success criteria, founder
--    profile sections) are jsonb. They are always read as a whole and never
--    queried field-by-field, so splitting them into tables would add joins
--    without buying anything.
--  * Every table is owned by a founder through its startup, and row level
--    security enforces that. A founder can only ever see their own startups.
--
-- Apply with:  supabase db execute --file data/supabase/migrations/0001_init.sql
-- ===========================================================================

-- --- enums -----------------------------------------------------------------

create type stage_id as enum (
  'FOUNDER','OPPORTUNITY','RESEARCH','VALIDATION','PRODUCT','BUILD','SETUP','LAUNCH'
);

create type stage_status as enum ('NOT_STARTED','IN_PROGRESS','BLOCKED','COMPLETE');

create type assumption_category as enum (
  'PROBLEM','CUSTOMER','MARKET','SOLUTION','WILLINGNESS_TO_PAY','PRICING','DISTRIBUTION','TECHNICAL'
);

create type assumption_status as enum (
  'UNTESTED','TESTING','SUPPORTED','PARTIALLY_SUPPORTED','REJECTED'
);

create type importance as enum ('LOW','MEDIUM','HIGH','CRITICAL');

create type epistemic_status as enum ('FACT','INFERENCE','HYPOTHESIS');

create type evidence_source_type as enum (
  'FOUNDER_INTERVIEW','CUSTOMER_INTERVIEW','MARKET_RESEARCH','COMPETITOR',
  'PUBLIC_DATA','OFFICIAL_SOURCE','EXPERIMENT','USER_INPUT','OTHER'
);

create type reliability as enum ('LOW','MEDIUM','HIGH');

create type approval_status as enum (
  'AI_RECOMMENDED','FOUNDER_APPROVED','FOUNDER_REJECTED','FOUNDER_EDITED'
);

create type opportunity_status as enum ('PROPOSED','SELECTED','PARKED','DISCARDED');

create type validation_method as enum (
  'CUSTOMER_INTERVIEW','LANDING_PAGE','FAKE_DOOR','WAITLIST','CONCIERGE',
  'PRICING_TEST','PRE_ORDER','PROTOTYPE_TEST','DESK_RESEARCH','UNKNOWN'
);

create type experiment_status as enum ('DESIGNED','RUNNING','COMPLETE','ABANDONED');

create type experiment_outcome as enum (
  'SUPPORTED','PARTIALLY_SUPPORTED','REJECTED','INCONCLUSIVE'
);

create type task_status as enum ('OPEN','IN_PROGRESS','COMPLETE','SKIPPED');

create type agent_name as enum (
  'FOUNDER_AGENT','OPPORTUNITY_AGENT','RESEARCH_AGENT','VALIDATION_AGENT',
  'PRODUCT_AGENT','ORCHESTRATOR'
);

create type agent_run_status as enum ('RUNNING','SUCCESS','FAILED','REJECTED');

create type actor_kind as enum ('FOUNDER','SYSTEM','BOTH');

-- --- founders --------------------------------------------------------------

create table founders (
  id text primary key,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  country text not null default 'SE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --- startups --------------------------------------------------------------

create table startups (
  id text primary key,
  founder_id text not null references founders(id) on delete cascade,
  name text not null,
  country text not null default 'SE',
  stage stage_id not null default 'FOUNDER',
  stage_status stage_status not null default 'IN_PROGRESS',
  selected_opportunity_id text,
  -- Each of these is {value, source, confidence, updatedAt} or null.
  problem jsonb,
  target_customer jsonb,
  solution jsonb,
  value_proposition jsonb,
  business_model jsonb,
  product_type jsonb,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index startups_founder_idx on startups(founder_id);

-- --- founder profiles ------------------------------------------------------

create table founder_profiles (
  id text primary key,
  founder_id text not null references founders(id) on delete cascade,
  startup_id text not null unique references startups(id) on delete cascade,
  skills jsonb not null default '[]',
  professional_experience jsonb not null default '[]',
  domain_exposure jsonb not null default '[]',
  network_access jsonb not null default '[]',
  constraints jsonb not null default '{}',
  motivation jsonb not null default '{}',
  preferences jsonb not null default '{}',
  claims jsonb not null default '[]',
  open_questions jsonb not null default '[]',
  advantages jsonb not null default '[]',
  confidence jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --- opportunities ---------------------------------------------------------

create table opportunities (
  id text primary key,
  startup_id text not null references startups(id) on delete cascade,
  title text not null,
  problem text not null,
  customer text not null,
  context text not null,
  proposed_solution text,
  founder_fit jsonb not null default '{}',
  claims jsonb not null default '[]',
  key_unknowns jsonb not null default '[]',
  risks jsonb not null default '[]',
  score jsonb not null default '{}',
  confidence jsonb not null default '{}',
  status opportunity_status not null default 'PROPOSED',
  approval approval_status not null default 'AI_RECOMMENDED',
  created_by text not null default 'AGENT',
  agent_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index opportunities_startup_idx on opportunities(startup_id);

-- --- assumptions -----------------------------------------------------------

create table assumptions (
  id text primary key,
  startup_id text not null references startups(id) on delete cascade,
  opportunity_id text references opportunities(id) on delete set null,
  statement text not null,
  category assumption_category not null,
  importance importance not null default 'MEDIUM',
  importance_reason text not null default '',
  status assumption_status not null default 'UNTESTED',
  confidence jsonb not null default '{}',
  validation_method validation_method not null default 'UNKNOWN',
  experiment_id text,
  created_by text not null default 'AGENT',
  agent_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index assumptions_startup_idx on assumptions(startup_id);
create index assumptions_status_idx on assumptions(startup_id, status);

-- --- evidence --------------------------------------------------------------
-- supports/contradicts are arrays of assumption ids. Kept as arrays rather
-- than a join table because evidence is always loaded per startup in full.

create table evidence (
  id text primary key,
  startup_id text not null references startups(id) on delete cascade,
  claim text not null,
  source text not null,
  source_type evidence_source_type not null,
  epistemic_status epistemic_status not null default 'FACT',
  reliability reliability not null default 'MEDIUM',
  relevance reliability not null default 'MEDIUM',
  supports text[] not null default '{}',
  contradicts text[] not null default '{}',
  detail text,
  recorded_by text not null default 'FOUNDER',
  agent_name text,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index evidence_startup_idx on evidence(startup_id);

-- --- decisions -------------------------------------------------------------

create table decisions (
  id text primary key,
  startup_id text not null references startups(id) on delete cascade,
  type text not null,
  decision text not null,
  reason text not null,
  evidence_ids text[] not null default '{}',
  alternatives_considered jsonb not null default '[]',
  confidence jsonb not null default '{}',
  made_by text not null default 'FOUNDER',
  system_recommendation text,
  would_change_if text,
  created_at timestamptz not null default now()
);

create index decisions_startup_idx on decisions(startup_id, created_at desc);

-- --- experiments -----------------------------------------------------------

create table experiments (
  id text primary key,
  startup_id text not null references startups(id) on delete cascade,
  assumption_id text not null references assumptions(id) on delete cascade,
  title text not null,
  hypothesis text not null,
  method validation_method not null,
  method_reasoning text not null default '',
  target_participants text not null default '',
  target_sample_size integer not null default 0,
  success_criteria jsonb not null default '[]',
  failure_criteria jsonb not null default '[]',
  estimated_hours numeric not null default 0,
  estimated_cost_sek numeric not null default 0,
  status experiment_status not null default 'DESIGNED',
  result jsonb,
  created_by text not null default 'AGENT',
  agent_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index experiments_startup_idx on experiments(startup_id);

-- --- tasks (next best action) ----------------------------------------------

create table tasks (
  id text primary key,
  startup_id text not null references startups(id) on delete cascade,
  title text not null,
  why text not null,
  expected_outcome text not null default '',
  assumption_id text references assumptions(id) on delete set null,
  experiment_id text references experiments(id) on delete set null,
  stage stage_id not null,
  agent agent_name not null,
  actor actor_kind not null default 'FOUNDER',
  founder_action text,
  success_criteria jsonb not null default '[]',
  estimated_minutes integer not null default 0,
  status task_status not null default 'OPEN',
  priority jsonb not null default '{}',
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  outcome_note text
);

create index tasks_startup_idx on tasks(startup_id, created_at desc);

-- Exactly one open primary task per startup. This is the product's core
-- constraint, so it is enforced by the database rather than by convention.
create unique index tasks_one_open_per_startup
  on tasks(startup_id)
  where status in ('OPEN','IN_PROGRESS');

-- --- product specs ---------------------------------------------------------

create table product_specs (
  id text primary key,
  startup_id text not null unique references startups(id) on delete cascade,
  opportunity_id text not null references opportunities(id) on delete cascade,
  problem text not null,
  target_customer text not null,
  core_job_to_be_done text not null,
  value_proposition text not null,
  core_workflow jsonb not null default '[]',
  features jsonb not null default '[]',
  out_of_scope jsonb not null default '[]',
  user_flows jsonb not null default '[]',
  success_metric jsonb not null default '{}',
  remaining_risks jsonb not null default '[]',
  approval approval_status not null default 'AI_RECOMMENDED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --- agent runs (cost + activity log) --------------------------------------

create table agent_runs (
  id text primary key,
  startup_id text not null references startups(id) on delete cascade,
  agent agent_name not null,
  provider text not null,
  model text not null,
  role text not null,
  input_summary text not null default '',
  output_summary text not null default '',
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  estimated_cost_sek numeric not null default 0,
  duration_ms integer not null default 0,
  status agent_run_status not null default 'RUNNING',
  error text,
  state_changes jsonb not null default '[]',
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index agent_runs_startup_idx on agent_runs(startup_id, started_at desc);

-- ===========================================================================
-- Row level security
--
-- One rule, applied everywhere: you can reach a row only if it belongs to a
-- startup owned by the founder record attached to your auth user.
-- ===========================================================================

alter table founders          enable row level security;
alter table startups          enable row level security;
alter table founder_profiles  enable row level security;
alter table opportunities     enable row level security;
alter table assumptions       enable row level security;
alter table evidence          enable row level security;
alter table decisions         enable row level security;
alter table experiments       enable row level security;
alter table tasks             enable row level security;
alter table product_specs     enable row level security;
alter table agent_runs        enable row level security;

create policy founders_own on founders
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy startups_own on startups
  for all using (
    founder_id in (select id from founders where user_id = auth.uid())
  ) with check (
    founder_id in (select id from founders where user_id = auth.uid())
  );

-- Helper: a startup id owned by the current user.
create or replace function owns_startup(sid text) returns boolean as $$
  select exists (
    select 1
    from startups s
    join founders f on f.id = s.founder_id
    where s.id = sid and f.user_id = auth.uid()
  );
$$ language sql security definer stable;

create policy founder_profiles_own on founder_profiles
  for all using (owns_startup(startup_id)) with check (owns_startup(startup_id));

create policy opportunities_own on opportunities
  for all using (owns_startup(startup_id)) with check (owns_startup(startup_id));

create policy assumptions_own on assumptions
  for all using (owns_startup(startup_id)) with check (owns_startup(startup_id));

create policy evidence_own on evidence
  for all using (owns_startup(startup_id)) with check (owns_startup(startup_id));

create policy decisions_own on decisions
  for all using (owns_startup(startup_id)) with check (owns_startup(startup_id));

create policy experiments_own on experiments
  for all using (owns_startup(startup_id)) with check (owns_startup(startup_id));

create policy tasks_own on tasks
  for all using (owns_startup(startup_id)) with check (owns_startup(startup_id));

create policy product_specs_own on product_specs
  for all using (owns_startup(startup_id)) with check (owns_startup(startup_id));

create policy agent_runs_own on agent_runs
  for all using (owns_startup(startup_id)) with check (owns_startup(startup_id));
