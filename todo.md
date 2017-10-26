 - reorganize crypt package. a single KVCrypt module will not cut it.
 - authentication layer for routes
 - service method for producing new encryption and signing keys,
   and then rebuilding the database (re-encrypt and sign everything).
 - consider signing the full database instead of just key-value records
