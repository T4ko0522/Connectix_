create table public.links (
  id character varying(255) not null,
  user_id integer not null,
  title character varying(255) not null,
  url text not null,
  type character varying(50) not null,
  custom_icon text null,
  constraint links_pkey primary key (id),
  constraint fk_user_id foreign KEY (user_id) references users (id)
) TABLESPACE pg_default;