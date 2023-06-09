export class PasswordSettingModel {
  id: number;
  password_change_frequency_days: number;
  password_expiry_notification: boolean;
  password_expiry_notification_days: number;
  failed_login_attempts: number;
  min_password_length: number;
  max_password_length: number;
  previous_passwords_disallowed: number;
  password_reset_required: boolean;
  complex_password_required: boolean;
  min_lowercase_chars: number;
  min_uppercase_chars: number;
  min_numeric_chars: number;
  min_special_chars: number;
}