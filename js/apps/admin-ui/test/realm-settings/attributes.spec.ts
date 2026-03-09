import { expect, test } from "@playwright/test";
import { v4 as uuid } from "uuid";
import adminClient from "../utils/AdminClient.ts";
import {
  assertAttribute,
  clickAttributeSaveButton,
  fillAttributeData,
} from "../utils/attributes.ts";
import { login } from "../utils/login.ts";
import { assertNotificationMessage } from "../utils/masthead.ts";
import { goToRealm, goToRealmSettings } from "../utils/sidebar.ts";

test.describe.serial("Realm settings attributes tab tests", () => {
  const realmName = `realm-settings-attributes-${uuid()}`;

  test.beforeAll(() =>
    adminClient.createRealm(realmName, {
      attributes: {
        existing: ["value-1"],
      },
    }),
  );
  test.afterAll(() => adminClient.deleteRealm(realmName));

  test.beforeEach(async ({ page }) => {
    await login(page);
    await goToRealm(page, realmName);
    await goToRealmSettings(page);
    await page.getByTestId("rs-attributes-tab").click();
  });

  test("can create and persist realm attributes", async ({ page }) => {
    await fillAttributeData(page, "new-key", "new-value");
    await clickAttributeSaveButton(page);
    await assertNotificationMessage(page, "Realm successfully updated");

    await goToRealm(page, realmName);
    await goToRealmSettings(page);
    await page.getByTestId("rs-attributes-tab").click();

    await assertAttribute(page, "existing", "value-1", 0);
    await assertAttribute(page, "new-key", "new-value", 1);
    await expect(
      page.locator('input[name="attributes\\.1\\.value"]'),
    ).toHaveValue("new-value");
  });
});
