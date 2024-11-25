"use client";

import { deleteEntity } from "@/client-api/utils";
import { useToast } from "@/hooks/useToast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Trash } from "lucide-react";

interface DeleteFormProps {
  entityId: string | number;
  entityCode: string;
}

const DeleteForm: React.FC<DeleteFormProps> = ({ entityId, entityCode }) => {
  const { toast } = useToast();
  const router = useRouter();
  const deleteEntityMutation = useMutation({
    mutationKey: [`delete${entityCode}`, entityId],
    mutationFn: () => deleteEntity(entityCode, entityId),
    onSuccess: () => {
      toast({});
      router.push(`/admin/${entityCode}`);
    },
    onError: () => {
      toast({ variant: "destructive" });
    },
  });
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button className="space-x-2" variant={"destructive"}>
            <Trash></Trash>
            <span>Delete</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
          </DialogHeader>
          <div>
            <p>Are you sure you want to delete this entity?</p>
            <div className="flex justify-end space-x-3">
              <DialogClose>
                <Button
                  isLoading={deleteEntityMutation.isPending}
                  variant={"secondary"}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                isLoading={deleteEntityMutation.isPending}
                onClick={() => deleteEntityMutation.mutate()}
                variant="destructive"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteForm;
