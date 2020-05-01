'use strict';
import * as authtoken from './auth-token';
import * as swagger from './swagger';
import * as good from './good';

export let Plugins = [].concat(authtoken, swagger, good);