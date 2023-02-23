import { equal, throws } from 'assert';
import { expect } from 'chai';
import { getAttributes, saveUser, updateAttributes, updatePassword } from '../src/index';

const uid = 'abc';
describe('Typescript usage suite', function () {
    // https://mochajs.org/#timeouts
    // An outer value of 'this' is shadowed by this container.
    // this.timeout(0);
    it('getAttributes should return a object result', async () => {
        equal(typeof await getAttributes(uid), 'object');
    });
    it('saveUser should return empty string', async () => {
        const result = await saveUser({ uid, cn: 'abc', password: '123', status: 'Inactive', container: 'ou=student,ou=People', pwdPolicy: 1, memberOf: ['bk'] });
        equal(result, '');
    });
    it('updateAttributes should return empty string', async () => {
        const result = await updateAttributes(uid, { status: 'Active' });
        equal(result, '');
    });
    it('updatePassword should return empty string', async () => {
        const result = await updatePassword(uid, 'old_password', 'new_password');
        equal(result, '');
    });
});