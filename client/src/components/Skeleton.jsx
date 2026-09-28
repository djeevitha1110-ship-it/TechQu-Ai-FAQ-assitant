import React from 'react';

export function CardSkeleton() {
  return (
    <div className="card" style={{ height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
          <div className="skeleton" style={{ width: '80px', height: '20px' }} />
          <div className="skeleton" style={{ width: '60px', height: '20px' }} />
        </div>
        <div className="skeleton" style={{ width: '85%', height: '24px', marginBottom: '0.75rem' }} />
        <div className="skeleton" style={{ width: '100%', height: '14px', marginBottom: '0.4rem' }} />
        <div className="skeleton" style={{ width: '90%', height: '14px', marginBottom: '0.4rem' }} />
      </div>
      <div className="skeleton" style={{ width: '100%', height: '20px' }} />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card" style={{ height: '110px' }}>
      <div className="skeleton" style={{ width: '40%', height: '16px', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ width: '30%', height: '32px', marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ width: '60%', height: '12px' }} />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
      <td style={{ padding: '1rem' }}><div className="skeleton" style={{ width: '70%', height: '18px' }} /></td>
      <td style={{ padding: '1rem' }}><div className="skeleton" style={{ width: '90px', height: '20px' }} /></td>
      <td style={{ padding: '1rem' }}><div className="skeleton" style={{ width: '100px', height: '16px' }} /></td>
      <td style={{ padding: '1rem' }}><div className="skeleton" style={{ width: '80px', height: '16px' }} /></td>
      <td style={{ padding: '1rem' }}><div className="skeleton" style={{ width: '30px', height: '18px' }} /></td>
    </tr>
  );
}
