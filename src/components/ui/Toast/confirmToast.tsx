/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface ConfirmToastProps {
  id: string | number;
  deleteFn: (id: string | number) => Promise<any>;
  title?: string;
  subtitle?: string;
  queryKeys?: string;
  successMessage?: string;
  failedMessage?: string;
  cancelMessage?: string;
  confirmBtnLabel?: string;
  cancelBtnLabel?: string;
}

export function ConfirmToast(props: ConfirmToastProps) {
  const queryClient = useQueryClient();

  return (
    <div className="p-3 rounded">
      <h5 className="font-bold text-lg text-warning m-0">{props.title}</h5>
      <p className="text-sm text-muted mb-2">{props.subtitle}</p>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          className="m-2 btn btn-sm btn-danger"
          onClick={async () => {
            try {
              const res = await props.deleteFn(props.id);
              if (res?.status === 200 || res?.status === 204) {
                toast.dismiss();
                toast.success(props.successMessage);
                if (props.queryKeys) {
                  queryClient.invalidateQueries({ queryKey: [props.queryKeys] });
                }
              } else {
                toast.dismiss();
                toast.error(`${props.failedMessage}: ${res?.status} ${res?.statusText}`);
              }
            } catch (err: any) {
              // console.log(err,'errerrerrerr')
              if (err.status === 409) {
                toast.dismiss();
                toast.error(`${props.failedMessage}: ${err.response.data || "Unknown error"}`);
              } else {
                toast.dismiss();
                toast.error(`${props.failedMessage}: ${err?.message || "Unknown error"}`);
              }
            }
          }}
        >
          {props.confirmBtnLabel}
        </button>

        <button
          className="m-2 btn btn-sm btn-secondary"
          onClick={() => {
            toast.dismiss();
            toast.info(props.cancelMessage);
          }}
        >
          {props.cancelBtnLabel}
        </button>
      </div>
    </div>
  );
}

// helper to open it
export const openConfirmToast = (props: ConfirmToastProps) => {
  toast(<ConfirmToast {...props} />, {
    type: "warning",
    autoClose: false,
    closeOnClick: false,
    draggable: false,
    closeButton: true,
    position: "top-center",
    style: {
      width: "400px",
      maxWidth: "90%",
      border: "2px solid #f0ad4e",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      marginTop: "30vh",
    },
  });
};
