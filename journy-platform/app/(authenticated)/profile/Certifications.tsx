'use client';

interface CertificationsProps {
    certificates: any[];
}

export default function Certifications({ certificates }: CertificationsProps) {
    return (
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Step 3 Details</p>
                </div>
            </div>

            {certificates && certificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert, index) => (
                        <div key={index} className="flex flex-col items-center p-6 bg-gray-50/50 rounded-[24px] border border-gray-100 group hover:border-[#4E001D]/20 transition-all">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-all">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4E001D" strokeWidth="1.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tight text-center mb-1">
                                {cert.certificate?.certificate_code || 'Certification'}
                            </h3>
                            <p className="text-[10px] text-gray-400 font-medium mb-3">Ref: {cert.reference_number || 'N/A'}</p>

                            {cert.verification_document_url && (
                                <a
                                    href={cert.verification_document_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-[#4E001D] hover:underline uppercase tracking-widest"
                                >
                                    View Document
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-300 italic text-sm">
                    No certifications added yet.
                </div>
            )}
        </div>
    );
}
