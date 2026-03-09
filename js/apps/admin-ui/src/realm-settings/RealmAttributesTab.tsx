import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  AttributeForm,
  AttributesForm,
} from "../components/key-value-form/AttributeForm";
import { arrayToKeyValue } from "../components/key-value-form/key-value-convert";
import { convertFormValuesToObject } from "../util";
import { UIRealmRepresentation } from "./RealmSettingsTabs";

type RealmAttributesTabProps = {
  realm: RealmRepresentation;
  save: (realm: UIRealmRepresentation) => Promise<void>;
};

export const RealmAttributesTab = ({
  realm,
  save,
}: RealmAttributesTabProps) => {
  const form = useForm<AttributeForm>({
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      attributes: arrayToKeyValue(realm.attributes || {}),
    });
  }, [form, realm]);

  const saveAttributes = async (attributeForm: AttributeForm) => {
    const attributes = convertFormValuesToObject(attributeForm).attributes;
    await save({ attributes });
  };

  return (
    <PageSection variant={PageSectionVariants.light}>
      <AttributesForm
        form={form}
        save={saveAttributes}
        reset={() =>
          form.reset({
            attributes: arrayToKeyValue(realm.attributes || {}),
          })
        }
      />
    </PageSection>
  );
};
