"use client";
import useSWR from "swr";
import toast, { Toaster } from "react-hot-toast";
import { useMemo, useState } from "react";
import { GstActionItem } from "@/types/domain";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data: gstItems = [], mutate } = useSWR<GstActionItem[]>("/api/gst/items", fetcher);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const pending = useMemo(() => gstItems.filter((i) => i.status !== "Completed"), [gstItems]);
  const completed = useMemo(() => gstItems.filter((i) => i.status === "Completed"), [gstItems]);

  const toggle = (id: string) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const generate = async (ids: string[]) => {
    if (!ids.length) return;
    const p = fetch("/api/gst/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemIds: ids }) })
      .then(() => mutate());
    toast.promise(p, { loading: `Syncing ${ids.length} credit note(s)...`, success: "Synced!", error: "Failed" });
    await p;
    setSelected(new Set());
  };

  return (
    <main className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-light mb-6 text-charcoal">GST Automation Hub</h1>
      <div className="flex justify-between mb-4 gap-2">
        <button className="bg-primary text-white rounded px-4 py-2" onClick={() => generate(Array.from(selected))} disabled={!selected.size}>Generate for {selected.size || 0} Selected</button>
        <a className="border rounded px-4 py-2" href="#" onClick={(e) => { e.preventDefault();
          if (!pending.length) return toast.error("No data to export.");
          const csv = "data:text/csv;charset=utf-8," + [Object.keys(pending[0]).join(","), ...pending.map((i) => Object.values(i).join(","))].join("\n");
          const link = document.createElement("a"); link.href = encodeURI(csv); link.download = "gst-automation-pending.csv"; link.click();
        }}>Export as CSV</a>
      </div>

      <section className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2">Select</th>
              <th className="p-2">Order Details</th>
              <th className="p-2">Dates</th>
              <th className="p-2">Value</th>
              <th className="p-2">GST To Reclaim</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">
                  <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggle(item.id)} />
                </td>
                <td className="p-2 text-charcoal">
                  <div>{item.customerName}</div>
                  <div className="text-xs text-light-grey">{item.products}</div>
                </td>
                <td className="p-2 text-charcoal">
                  <div>Invoice: {item.originalInvoiceDate}</div>
                  <div className="text-xs">RTO: {item.rtoDate ?? "-"}</div>
                </td>
                <td className="p-2 text-charcoal">₹{item.orderValue.toFixed(2)}</td>
                <td className="p-2 font-semibold text-charcoal">₹{item.gstToReclaim.toFixed(2)}</td>
                <td className="p-2 text-warning">{item.status}</td>
                <td className="p-2">
                  <button className="border rounded px-3 py-1" onClick={() => generate([item.id])}>Generate & Sync</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <h2 className="text-xl mt-8 mb-2">Completed</h2>
      <ul className="space-y-1">
        {completed.map((i) => (
          <li key={i.id} className="text-sm text-charcoal">{i.customerName} • ₹{i.gstToReclaim.toFixed(2)} • {i.status}</li>
        ))}
      </ul>
    </main>
  );
}

