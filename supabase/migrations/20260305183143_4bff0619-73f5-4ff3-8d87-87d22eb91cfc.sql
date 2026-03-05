DELETE FROM public.social_connections a USING public.social_connections b WHERE a.id > b.id AND a.user_id = b.user_id AND a.provider = b.provider;

ALTER TABLE public.social_connections ADD CONSTRAINT social_connections_user_provider_unique UNIQUE (user_id, provider);