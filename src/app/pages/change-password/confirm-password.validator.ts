import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchPassword(control: AbstractControl) {
    const password = control.get('new_password').value;

    const confirmPassword = control.get('verify_password').value;

    if (password !== confirmPassword) {
      control.get('verify_password').setErrors({ passwordMismatch: true });
    } else {
      return null;
    }
  }
}
