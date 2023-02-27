import axios from 'axios';

export function setDefaultAuthHeaders(accessToken?: string | null): void {
  axios.defaults.headers.common.Authorization = accessToken || '';
}
