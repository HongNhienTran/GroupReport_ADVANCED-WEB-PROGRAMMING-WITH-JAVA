const GUEST_SESSION_KEY = 'sweetlab_guest_session_id';

export function getGuestSessionId() {
  let id = localStorage.getItem(GUEST_SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(GUEST_SESSION_KEY, id);
  }
  return id;
}
