 - reorganize crypt package. a single KVCrypt module will not cut it.
 - authentication layer for routes
 - service method for producing new encryptiong and signing keys,
   and then rebuilding the database (re-encrypt and sign everything).
