CREATE KEYSPACE IF NOT EXISTS sentinel
WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 1
};