"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
};

/**
 * Renders a confirm modal component.
 *
 * @param {ConfirmModalProps} props - The properties for the confirm modal.
 * @param {ReactNode} props.children - The content of the confirm modal.
 * @param {() => void} props.onConfirm - The callback function to be called when the confirm button is clicked.
 * @return {JSX.Element} The JSX element representing the confirm modal.
 */
export const ConfirmModal = ({
  children,
  onConfirm
}: ConfirmModalProps) => {
  /**
   * Handles the confirm event.
   *
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e - The event object.
   * @return {void} No return value.
   */
  const handleConfirm = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    onConfirm();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={e => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}