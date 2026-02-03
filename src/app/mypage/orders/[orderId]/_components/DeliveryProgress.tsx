export function DeliveryProgress({ step, labels }: { step: number; labels: string[] }) {
  return (
    <>
      {/* Mobile*/}
      <div className="mt-4 sm:hidden">
        <div className="space-y-3">
          {labels.map((label, idx) => {
            const active = idx <= step;
            const isLast = idx === labels.length - 1;

            return (
              <div key={label} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={[
                      "w-3 h-3 rounded-full mt-1",
                      active ? "bg-black" : "bg-gray-300",
                    ].join(" ")}
                  />
                  {!isLast && (
                    <div
                      className={active ? "w-[2px] flex-1 bg-black" : "w-[2px] flex-1 bg-gray-300"}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={active ? "text-black text-sm font-medium" : "text-gray-500 text-sm"}
                  >
                    {label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop */}
      <div className="mt-4 hidden sm:block">
        <div className="flex items-center gap-2">
          {labels.map((label, idx) => {
            const active = idx <= step;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <div
                    className={["w-3 h-3 rounded-full", active ? "bg-black" : "bg-gray-300"].join(
                      " ",
                    )}
                  />
                  <span
                    className={[
                      "text-sm",
                      active ? "text-black font-medium" : "text-gray-500",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                </div>

                {idx !== labels.length - 1 && (
                  <div
                    className={active ? "h-[2px] flex-1 bg-black" : "h-[2px] flex-1 bg-gray-300"}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
