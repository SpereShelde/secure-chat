import crypto from 'crypto';
import BaseController from './base-controller';

class CodeController extends BaseController {
  async verifySignature(code, pubKey, signature) {
    const exist = await this.checkExist({ code });
    if (!exist) {
      return false;
    }

    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(code);
    verify.end();
    return verify.verify(pubKey, Buffer.from(signature, 'hex'));
  }
}

export default CodeController;
