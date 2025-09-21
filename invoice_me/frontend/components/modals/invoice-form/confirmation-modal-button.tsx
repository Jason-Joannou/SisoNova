import { InvoiceConfiguration } from "@/lib/types/invoicing";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { buttonWithIconInformation } from "@/lib/types/user-interface";

interface ConfirmationModalProps {
  modalInformation: {
    modalTitle: string;
    modalDescription: string;
  };
  buttonInformation: buttonWithIconInformation;
  config: InvoiceConfiguration;
  updateInvoiceConfig: (section: string, field: string, value: any) => void;
  toggleComponent: (
    component:
      | "notes"
      | "paymentTerms"
      | "paymentMethods"
      | "lateFees"
      | "earlyDiscount"
      | "clientAddress"
      | "businessDetails"
      | "vatSettings"
  ) => void;
  componentInfo: {
    component:
      | "notes"
      | "paymentTerms"
      | "paymentMethods"
      | "lateFees"
      | "earlyDiscount"
      | "clientAddress"
      | "businessDetails"
      | "vatSettings";
    section: string;
    field: string;
    value?: any;
  };
}

export function ConfirmationModalWithButton({
  modalInformation,
  buttonInformation,
  componentInfo,
  config,
  updateInvoiceConfig,
  toggleComponent,
}: ConfirmationModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={buttonInformation.buttonVariant}
          size={buttonInformation.buttonSize}
          className={buttonInformation?.buttonClass ?? ""}
        >
          {buttonInformation?.buttonIcon ?? buttonInformation.buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{modalInformation.modalTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {modalInformation.modalDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              updateInvoiceConfig(
                componentInfo.section,
                componentInfo.field,
                componentInfo.value
              );
              toggleComponent(componentInfo.component);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
