create table public.users (
  id serial not null,
  username character varying(50) not null,
  email character varying(100) not null,
  password_hash text not null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone null default CURRENT_TIMESTAMP,
  verification_token text null,
  is_verified boolean null default false,
  reset_token text null,
  reset_token_expiry timestamp without time zone null,
  constraint users_pkey primary key (id),
  constraint unique_username unique (username),
  constraint users_email_key unique (email),
  constraint users_username_key unique (username)
) TABLESPACE pg_default;