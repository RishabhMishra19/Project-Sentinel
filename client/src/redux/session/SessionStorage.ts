import type { TenantSummary } from "../../features/auth/dto/response/auth.response";
import { localStorageManager } from "../../shared/storage/LocalStorageManager";

export type PersistedSession = {
  isLoggedIn: boolean;
  activeTenant: TenantSummary | null;
};

/**
 * localStorage for the bits of session that survive a reload.
 * Redux reads once via {@link SessionStorage.loadPersistedSession}; writes go
 * through {@link SessionStorage.savePersistedSession}.
 */
export class SessionStorage {
  private static readonly IS_LOGGED_IN_KEY = "sentinel.isLoggedIn";
  private static readonly ACTIVE_TENANT_KEY = "sentinel.activeTenant";

  static loadPersistedSession(): PersistedSession {
    return {
      isLoggedIn: localStorageManager.get(SessionStorage.IS_LOGGED_IN_KEY) === "true",
      activeTenant: SessionStorage.readActiveTenant(),
    };
  }

  static clearPersistedSession(): void {
    localStorageManager.remove(SessionStorage.IS_LOGGED_IN_KEY);
    localStorageManager.remove(SessionStorage.ACTIVE_TENANT_KEY);
  }

  static savePersistedSession(session: PersistedSession): void {
    if (session.isLoggedIn) {
      localStorageManager.set(SessionStorage.IS_LOGGED_IN_KEY, "true");
    } else {
      localStorageManager.remove(SessionStorage.IS_LOGGED_IN_KEY);
    }

    if (session.activeTenant) {
      localStorageManager.set(
        SessionStorage.ACTIVE_TENANT_KEY,
        JSON.stringify(session.activeTenant),
      );
    } else {
      localStorageManager.remove(SessionStorage.ACTIVE_TENANT_KEY);
    }
  }

  private static readActiveTenant(): TenantSummary | null {
    const raw = localStorageManager.get(SessionStorage.ACTIVE_TENANT_KEY);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (
        parsed &&
        typeof parsed === "object" &&
        "id" in parsed &&
        "name" in parsed &&
        typeof (parsed as TenantSummary).id === "string" &&
        typeof (parsed as TenantSummary).name === "string"
      ) {
        return {
          id: (parsed as TenantSummary).id,
          name: (parsed as TenantSummary).name,
        };
      }
    } catch {
      return null;
    }
    return null;
  }
}
