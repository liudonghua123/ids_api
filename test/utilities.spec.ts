import { equal } from 'assert';
import { signData, generateRandomString } from '../src/utlities';

describe('utlities usage suite', () => {
  
  it('generateRandomString should return string of default length 16', () => {
    equal(generateRandomString().length, 16);
  });

  it('generateRandomString should return string of default length specified', () => {
    const length = 32;
    equal(generateRandomString(length).length, length);
  });

  it('signData should return expected string', () => {
    // sort and join ["token", "1677113367247", "ABCDEFGHIJKLMNOP", "data"] to 1677113367247ABCDEFGHIJKLMNOPdatatoken
    // echo -n 1677113367247ABCDEFGHIJKLMNOPdatatoken | sha1sum # fd6bdb662a9927871f7a0be0a8195a35c6db1366
    equal(signData('token', '1677113367247', 'ABCDEFGHIJKLMNOP', 'data'), 'fd6bdb662a9927871f7a0be0a8195a35c6db1366');
  });
});