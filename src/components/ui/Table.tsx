import React from 'react';

export const Table = ({ headers, rows }: { headers: string[], rows: React.ReactNode[][] }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((h, i) => <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
