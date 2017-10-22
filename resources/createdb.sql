drop table if exists kvstore;

create table if not exists kvstore (
	key text not null primary key,
	value text not null,
	signature text not null
) without rowid;
