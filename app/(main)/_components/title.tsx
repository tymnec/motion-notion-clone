"use client";

// Import necessary modules and components
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Represents the props for the Title component.
 */
interface TitleProps {
  /**
   * The initial data for the Title component.
   */
  initialData: Doc<"documents">;
};

/**
 * Renders a Title component.
 *
 * @param {TitleProps} initialData - The initial data for the Title component.
 * @return {JSX.Element} The rendered Title component.
 */
export const Title = ({
  initialData
}: TitleProps) => {
  // Reference to the input element
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Mutation hook for updating documents
  const update = useMutation(api.documents.update);
  
  // State for the title of the document
  const [title, setTitle] = useState(initialData.title || "Untitled");
  
  // State for tracking if the document is being edited
  const [isEditing, setIsEditing] = useState(false);

/**
 * Enables input and sets initial data.
 *
 * @return {void} No return value.
 */
  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
    }, 0);
  };

  /**
   * Disables the input by setting the `isEditing` state to `false`.
   *
   * @return {void} 
   */
  const disableInput = () => {
    setIsEditing(false);
  };

  /**
   * Handles the change event of the input field.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event triggered by the input field.
   * @return {void} This function does not return a value.
   */
  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(event.target.value);
    update({
      id: initialData._id,
      title: event.target.value || "Untitled"
    });
  };

  /**
   * Handles the key down event for the input element.
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} event - The key down event object.
   */
  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">
            {initialData?.title}
          </span>
        </Button>
      )}
    </div>
  )
}

/**
 * Creates a skeleton for the Title component.
 *
 * @return {JSX.Element} The skeleton component.
 */
Title.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className="h-9 w-20 rounded-md" />
  );
};
