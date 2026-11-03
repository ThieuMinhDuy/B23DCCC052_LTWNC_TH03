import { ImageResponse } from 'next/og';
import { getDeadlineById, getSubjectBySlug } from '@/lib/data';

// og image config
export const runtime = 'nodejs';
export const alt = 'Class Deadline Hub - Chi tiết Deadline';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// dynamic og image generator
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);
  const subject = deadline ? await getSubjectBySlug(deadline.subjectSlug) : null;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#09090b',
          padding: '60px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        {/* top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '900',
              }}
            >
              DH
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e4e4e7' }}>
              Class Deadline Hub • PTIT
            </div>
          </div>
          {subject && (
            <div
              style={{
                backgroundColor: '#1e293b',
                color: '#38bdf8',
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              {subject.code}
            </div>
          )}
        </div>

        {/* middle content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '44px',
              fontWeight: '900',
              lineHeight: 1.2,
              color: '#ffffff',
            }}
          >
            {deadline ? deadline.title : 'Chi tiết Deadline học phần'}
          </div>
          {subject && (
            <div style={{ fontSize: '24px', color: '#a1a1aa' }}>
              Môn: {subject.name} (GV: {subject.teacher})
            </div>
          )}
        </div>

        {/* bottom footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #27272a',
            paddingTop: '24px',
          }}
        >
          <div style={{ fontSize: '20px', color: '#f59e0b', fontWeight: 'bold' }}>
            Hạn chót: {deadline ? new Date(deadline.dueDate).toLocaleDateString('vi-VN') : '--'}
          </div>
          <div style={{ fontSize: '18px', color: '#71717a' }}>
            Học viện Công nghệ Bưu chính Viễn thông
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
