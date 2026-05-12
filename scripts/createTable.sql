-- Run this in the Supabase SQL Editor before running insertScenarios.ts

create table if not exists scenarios (
  id                bigint generated always as identity primary key,
  title             text not null,
  difficulty        text not null,
  street            text not null default 'river',
  board             text[] not null,
  hand              text[] not null,
  position          text not null,
  pot               integer not null,
  player_stack      integer not null,
  villain_stack     integer not null,
  villain_type      text not null,
  villain_action    text not null,
  villain_bet_amount integer,
  hand_category     text not null,
  equity            numeric(4,2) not null,
  available_actions text[] not null,
  explanation       text not null default ''
);

-- Allow anonymous reads (the app uses the anon key)
alter table scenarios enable row level security;

create policy "Public read" on scenarios
  for select using (true);
