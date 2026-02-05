"use client";

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <span className="w-40 text-gray-600">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function FeatureCard({
  icon,
  iconWrapClassName,
  title,
  desc,
}: {
  icon: React.ReactNode;
  iconWrapClassName: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${iconWrapClassName}`}>
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

export function Section({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

export function Step({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
        {num}
      </div>
      <div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  );
}

export function GuideCard({ cmd, desc }: { cmd: string; desc: string }) {
  return (
    <div className="bg-white rounded-lg p-4">
      <p className="font-medium mb-2">{cmd}</p>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
