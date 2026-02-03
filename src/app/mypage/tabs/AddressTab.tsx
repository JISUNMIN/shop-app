import { MapPin, CheckCircle2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useAddress from "@/hooks/useAddress";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { AddressCreateDialog } from "@/app/order/_components/dialogs/AddressCreateDialog";
import { Address } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AddressTabSkeleton from "../_components/AddressTabSkeleton";

export default function AddressTab() {
  const { listData, isListLoading, deleteAddressMutate, isDeletePending } = useAddress();
  const { t } = useTranslation();
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowAddressDialog(true);
  };

  const handleCreate = () => {
    setEditingAddress(null);
    setShowAddressDialog(true);
  };

  const handleDelete = (addressId: number) => {
    deleteAddressMutate({ addressId });
  };

    if (isListLoading) {
    return <AddressTabSkeleton />;
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{t("mypage.shipping.title")}</h1>

      <div className="space-y-4 mb-6">
        {listData?.map((address) => (
          <Card
            key={address.id}
            className={`p-4 md:p-6 transition-all ${
              address.isDefault ? "border-blue-500 bg-blue-50" : "bg-gray-50"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
              <div className="flex items-center gap-2">
                <p className="font-bold text-lg">{address.label}</p>

                {address.isDefault && (
                  <>
                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                      {t("order.shipping.default")}
                    </Badge>
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={() => handleEdit(address)}>
                  {t("edit")}
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={isDeletePending || address.isDefault}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(address.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </span>
                    </TooltipTrigger>

                    {address.isDefault && (
                      <TooltipContent>
                        <p> {t("mypage.shipping.default_cannot_delete")}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <p className="text-gray-600 mb-1">
              {address.name} · {address.phone}
            </p>
            <p className="text-gray-600">
              {address.address1} {address.address2}
            </p>
          </Card>
        ))}
      </div>

      <div className="w-full space-y-1">
        <Button
          className="w-full"
          size="lg"
          onClick={handleCreate}
          disabled={isListLoading || (listData?.length ?? 0) >= 5}
        >
          <MapPin className="w-4 h-4 mr-2" />
          {t("order.addressDialog.title")}
        </Button>

        {!isListLoading && (listData?.length ?? 0) >= 5 && (
          <p className="text-xs text-gray-500 text-center mt-2">{t("order.shipping.maxAddress")}</p>
        )}
      </div>

      <AddressCreateDialog
        open={showAddressDialog}
        onOpenChange={setShowAddressDialog}
        editingAddress={editingAddress}
      />
    </div>
  );
}
