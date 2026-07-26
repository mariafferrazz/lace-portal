import { eventYearOptions, fieldClass } from "../../constants";

export default function EventYearField({ value, onYearChange, label }) {
  return (
    <label className="font-semibold">
      {label}
      <select className={fieldClass} required value={value} onChange={onYearChange}>
        {eventYearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
      </select>
    </label>
  );
}
