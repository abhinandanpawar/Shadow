'use client';

import React from 'react';
import { Button, Modal } from '@resume-platform/ui';
import { useResumeStore } from '@/store/resume';

const ResumeAnalysis: React.FC = () => {
    const improvedResult = useResumeStore((state) => state.improvedResult);

    if (!improvedResult) {
        return (
            <div className="bg-gray-900/80 p-6 rounded-lg shadow-xl text-gray-100 border border-gray-800/50">
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Resume Analysis</h3>
                <p className="text-sm text-gray-400">
                    Upload a job description to see an analysis of your resume's match.
                </p>
            </div>
        );
    }

    const { data } = improvedResult;
    const score = Math.round(data.new_score * 100);
    const { details = '', commentary = '', improvements = [] } = data;

    const getScoreColor = (value: number) => {
        if (value >= 80) return 'text-green-500';
        if (value >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const truncatedDetails = details.length > 100 ? details.slice(0, 97) + '...' : details;
    const truncatedCommentary = commentary.length > 100 ? commentary.slice(0, 97) + '...' : commentary;

    return (
        <div className="bg-gray-900/80 p-6 rounded-lg shadow-xl text-gray-100 border border-gray-800/50">
            <Modal
                trigger={
                    <div className="cursor-pointer">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-100">Resume Analysis</h3>
                            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                                {score}
                                <span className="text-sm">/100</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{truncatedDetails}</p>
                        <p className="text-sm text-gray-400">{truncatedCommentary}</p>
                        <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto mt-2 text-sm">
                            View Full Analysis
                        </Button>
                    </div>
                }
                title="Detailed Resume Analysis"
                description="A detailed breakdown of your resume's score and suggestions for improvement."
            >
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="md:col-span-1 bg-background p-4 rounded-lg border">
                            <h4 className="text-lg font-semibold text-primary mb-2">Overall Score</h4>
                            <div className="flex items-center justify-center">
                                <div className={`text-6xl font-bold ${getScoreColor(score)}`}>{score}</div>
                                <div className="text-2xl text-muted-foreground">/100</div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5 mt-3">
                                <div
                                    className={`h-2.5 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${score}%` }}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-background p-4 rounded-lg border">
                            <h4 className="text-lg font-semibold text-primary mb-2">Summary</h4>
                            <p className="text-sm mb-1">
                                <strong>Details:</strong> {details}
                            </p>
                            <p className="text-sm">
                                <strong>Commentary:</strong> {commentary}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Improvement Suggestions</h4>
                        {improvements.length > 0 ? (
                            <ul className="space-y-3">
                                {improvements.map((item, idx) => (
                                    <li key={idx} className="bg-background p-4 rounded-md shadow border">
                                        <p className="text-sm">{item.suggestion}</p>
                                        {item.lineNumber && (
                                            <p className="text-xs text-muted-foreground mt-1">Reference: {item.lineNumber}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground text-sm">No specific improvement suggestions at this time.</p>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ResumeAnalysis;