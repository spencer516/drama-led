"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type Props = {
  isOpen: boolean;
  error: string;
  setOpen: (isOpen: boolean) => void;
};

export default function ErrorModal({ isOpen, error, setOpen }: Props) {
  return (
    <Dialog
      open={isOpen}
      onClose={setOpen}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-7/12 sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="flex">
              <div className="grow-0 shrink-0 mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                <ExclamationTriangleIcon
                  aria-hidden="true"
                  className="size-6 text-red-600"
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left shrink-1 grow-1 overflow-auto">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold text-gray-900"
                >
                  Message Error
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    There was an error with this message. Please see below for
                    details.
                  </p>
                  <pre className="text-sm font-mono overflow-auto">{error}</pre>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:ml-10 sm:flex sm:pl-4">
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
