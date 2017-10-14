drop table if exists kvstore;

create table if not exists kvstore (
	key text not null primary key,
	value text
) without rowid;
