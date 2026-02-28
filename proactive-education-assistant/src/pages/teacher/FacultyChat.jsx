import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
	FaArrowLeft,
	FaFileAlt,
	FaFilePdf,
	FaPaperclip,
	FaPaperPlane,
	FaRobot,
	FaUserFriends,
} from "react-icons/fa";
import apiService from "../../services/apiService";

const getConversationId = (a, b) => [a, b].sort().join("__");

const fileToDataUrl = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});

const fmtTime = (iso) => {
	try {
		return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	} catch {
		return "";
	}
};

export default function FacultyChat() {
	const [params, setParams] = useSearchParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [currentTeacher, setCurrentTeacher] = useState(null);
	const [connections, setConnections] = useState([]);
	const [messagesStore, setMessagesStore] = useState({});
	const [selectedFacultyId, setSelectedFacultyId] = useState("");
	const [text, setText] = useState("");
	const [sending, setSending] = useState(false);
	const [attachmentDraft, setAttachmentDraft] = useState(null);
	const [aiMode, setAiMode] = useState(false);
	const [aiSuggestions, setAiSuggestions] = useState([]);
	const [aiLoading, setAiLoading] = useState(false);
	const [pendingConfirmation, setPendingConfirmation] = useState(null);

	const fileInputRef = useRef(null);
	const bottomRef = useRef(null);

	// Load initial data
	useEffect(() => {
		const loadInitialData = async () => {
			setLoading(true);
			setError("");

			try {
				// Get current user from API
				const result = await apiService.getCurrentUser();
				if (!result?.success || !result?.user) {
					throw new Error("Unable to load your user profile.");
				}

				const sessionTeacher = {
					id: result.user.id,
					name: result.user.fullName,
					email: result.user.email,
					schoolId: result.user.schoolId,
					schoolName: result.school?.name || "My School",
				};

				setCurrentTeacher(sessionTeacher);

				// Load accepted connections (faculty members) from API
				const connectionsResult = await apiService.getAcceptedConnections();
				if (connectionsResult?.success) {
					setConnections(connectionsResult.connections || []);
				}

				// Load AI suggestions
				try {
					const suggestionsResult = await apiService.getAISuggestions();
					if (suggestionsResult?.success) {
						setAiSuggestions(suggestionsResult.suggestions || []);
					}
				} catch (err) {
					console.error('Failed to load AI suggestions:', err);
				}

				// Check if a specific faculty was passed in URL
				const requestedFacultyId = params.get("facultyId");
				if (requestedFacultyId) {
					setSelectedFacultyId(requestedFacultyId);
				}
			} catch (err) {
				console.error("Load error:", err);
				setError(err.message || "Failed to load chat data");
			} finally {
				setLoading(false);
			}
		};

		loadInitialData();
	}, [params]);

	// Load conversation messages from backend when faculty is selected
	useEffect(() => {
		const loadConversation = async () => {
			if (!selectedFacultyId || !currentTeacher) return;

			try {
				setError("");
				const result = await apiService.getConversation(selectedFacultyId, 100);
				
				if (result?.success && Array.isArray(result.messages)) {
					const conversationId = getConversationId(currentTeacher.id, selectedFacultyId);
					setMessagesStore((prev) => ({
						...prev,
						[conversationId]: result.messages.map((msg) => ({
							id: msg.id,
							conversationId,
							senderId: msg.senderId,
							receiverId: msg.recipientId,
							text: msg.text,
							attachment: msg.attachmentName ? {
								name: msg.attachmentName,
								type: msg.attachmentType,
								dataUrl: msg.attachmentData,
							} : null,
							createdAt: msg.createdAt,
						})),
					}));
				}
			} catch (err) {
				console.error("Failed to load conversation:", err);
				setError("Failed to load conversation history");
			}
		};

		loadConversation();

		// Set up polling to refresh conversation every 3 seconds
		const pollInterval = setInterval(loadConversation, 3000);

		// Cleanup interval when component unmounts or faculty changes
		return () => clearInterval(pollInterval);
	}, [selectedFacultyId, currentTeacher]);

	// Derive connected faculty list from API response
	const connectedFaculty = useMemo(() => {
		if (!currentTeacher || !connections.length) return [];
		return connections;
	}, [currentTeacher, connections]);

	// Get the selected faculty member
	const selectedFaculty = useMemo(() => {
		return connectedFaculty.find((f) => f.id === selectedFacultyId);
	}, [connectedFaculty, selectedFacultyId]);

	// Get conversation ID for selected faculty
	const currentConversationId = useMemo(() => {
		if (aiMode) return 'ai-assistant';
		if (!currentTeacher || !selectedFaculty) return null;
		return getConversationId(currentTeacher.id, selectedFaculty.id);
	}, [currentTeacher, selectedFaculty, aiMode]);

	// Get messages for current conversation
	const currentMessages = useMemo(() => {
		if (!currentConversationId) return [];
		return messagesStore[currentConversationId] || [];
	}, [messagesStore, currentConversationId]);

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [currentMessages]);

	const onChooseFile = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (file.size > 1.5 * 1024 * 1024) {
			setError("Please upload file up to 1.5MB for chat attachment.");
			event.target.value = "";
			return;
		}

		try {
			setError("");
			const dataUrl = await fileToDataUrl(file);
			setAttachmentDraft({
				name: file.name,
				type: file.type || "application/octet-stream",
				size: file.size,
				dataUrl,
			});
		} catch {
			setError("Failed to attach file.");
		} finally {
			event.target.value = "";
		}
	};

	const sendMessage = async () => {
		if (!currentTeacher) return;
		if (!text.trim() && !attachmentDraft) return;

		// Handle AI mode
		if (aiMode) {
			await handleAIQuery();
			return;
		}

		// Regular message sending
		if (!selectedFaculty || !currentConversationId) return;

		setSending(true);
		try {
			// Call backend API to send message
			const result = await apiService.sendMessage(
				selectedFaculty.id,
				text.trim(),
				attachmentDraft?.name || null,
				attachmentDraft?.type || null,
				attachmentDraft?.dataUrl || null
			);

			if (result?.success) {
				setText("");
				setAttachmentDraft(null);
				setError("");

				// Reload conversation from backend to sync changes
				const conversationResult = await apiService.getConversation(selectedFaculty.id, 100);
				if (conversationResult?.success && Array.isArray(conversationResult.messages)) {
					setMessagesStore((prev) => ({
						...prev,
						[currentConversationId]: conversationResult.messages.map((msg) => ({
							id: msg.id,
							conversationId: currentConversationId,
							senderId: msg.senderId,
							receiverId: msg.recipientId,
							text: msg.text,
							attachment: msg.attachmentName ? {
								name: msg.attachmentName,
								type: msg.attachmentType,
								dataUrl: msg.attachmentData,
							} : null,
							createdAt: msg.createdAt,
						})),
					}));
				}

				// Auto-scroll to bottom
				setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
			} else {
				setError(result?.error || "Failed to send message");
			}
		} catch (err) {
			console.error("Send message error:", err);
			setError(err.message || "Unable to send message.");
		} finally {
			setSending(false);
		}
	};

	const handleAIQuery = async () => {
		if (!text.trim()) return;

		setAiLoading(true);
		setSending(true);
		setError("");

		try {
			// Prepare request body
			const requestBody = {
				query: text.trim()
			};
			
			// If there's a pending confirmation, include it
			if (pendingConfirmation) {
				requestBody.confirmAction = pendingConfirmation.confirmAction;
				requestBody.confirmData = pendingConfirmation.confirmData;
			}
			
			const result = await apiService.queryAIAssistant(requestBody.query, requestBody.confirmAction, requestBody.confirmData);

			if (result?.success) {
				// Create a temporary AI conversation ID
				const aiConversationId = 'ai-assistant';
				
				// Add user query to messages
				const userMessage = {
					id: `user-${Date.now()}`,
					conversationId: aiConversationId,
					senderId: currentTeacher.id,
					receiverId: 'ai',
					text: text.trim(),
					createdAt: new Date().toISOString(),
				};

				// Add AI response to messages
				const aiMessage = {
					id: `ai-${Date.now()}`,
					conversationId: aiConversationId,
					senderId: 'ai',
					receiverId: currentTeacher.id,
					text: result.response,
					isAI: true,
					data: result.data,
					type: result.type,
					needsConfirmation: result.needsConfirmation,
					confirmAction: result.confirmAction,
					confirmData: result.confirmData,
					createdAt: new Date().toISOString(),
				};

				setMessagesStore((prev) => ({
					...prev,
					[aiConversationId]: [...(prev[aiConversationId] || []), userMessage, aiMessage],
				}));

				setText("");
				
				// Set pending confirmation if needed
				if (result.needsConfirmation) {
					setPendingConfirmation({
						confirmAction: result.confirmAction,
						confirmData: result.confirmData
					});
				} else {
					setPendingConfirmation(null);
				}
				
				// Auto-scroll to bottom
				setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
			} else {
				setError(result?.error || "Failed to process AI query");
			}
		} catch (err) {
			console.error("AI query error:", err);
			setError(err.message || "Unable to process AI query");
		} finally {
			setAiLoading(false);
			setSending(false);
		}
	};

	// if (loading) {
	// 	return (
	// 		<div className="min-h-screen bg-slate-100 p-6">
	// 			<div className="mx-auto max-w-6xl">
	// 				<div className="rounded-xl border bg-white p-8 text-center text-slate-600">
	// 					Loading faculty chat...
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// }

	return (
		<div className="min-h-screen bg-slate-100 p-6" style={{ paddingTop: '5rem' }}>
			<div className="mx-auto max-w-6xl space-y-5">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold text-slate-900">Faculty Chat</h1>
						<p className="mt-1 text-sm text-slate-600">
							Chat is enabled only after invitation is accepted.
						</p>
					</div>
					<Link
						to="/faculty-connect"
						className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
					>
						<FaArrowLeft /> Back to Connect
					</Link>
				</div>

				{error && (
					<div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
						{error}
					</div>
				)}

				<div className="grid min-h-[620px] gap-4 lg:grid-cols-[280px_1fr]">
					<aside className="rounded-xl border bg-white">
						<div className="border-b px-4 py-3">
							<h2 className="text-sm font-semibold text-slate-900">Connections</h2>
						</div>

						<div className="divide-y">
							{/* AI Assistant Option */}
							<button
								onClick={() => {
									setAiMode(true);
									setSelectedFacultyId('');
								}}
								className={`w-full px-4 py-3 text-left transition flex items-center gap-3 ${
									aiMode ? "bg-blue-50 border-l-4 border-blue-600" : "hover:bg-slate-50"
								}`}
							>
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
									<FaRobot className="text-white" />
								</div>
								<div>
									<p className="font-medium text-slate-900">AI Assistant</p>
									<p className="text-xs text-slate-500">Ask about student data</p>
								</div>
							</button>

							{connectedFaculty.length === 0 ? (
								<div className="p-4 text-sm text-slate-500">
									<div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
										<FaUserFriends />
									</div>
									<p>No accepted invitation yet.</p>
									<Link
										to="/faculty-connect"
										className="mt-2 inline-block text-blue-600 hover:underline"
									>
										Go to Faculty Connect
									</Link>
								</div>
							) : (
								connectedFaculty.map((faculty) => (
									<button
										key={faculty.id}
										onClick={() => {
											setSelectedFacultyId(faculty.id);
											setAiMode(false);
										}}
										className={`w-full px-4 py-3 text-left transition ${
											selectedFacultyId === faculty.id && !aiMode ? "bg-blue-50" : "hover:bg-slate-50"
										}`}
									>
										<p className="font-medium text-slate-900">{faculty.name}</p>
										<p className="text-xs text-slate-500">{faculty.email}</p>
									</button>
								))
							)}
						</div>
					</aside>

					<section className="flex flex-col rounded-xl border bg-white">
						{aiMode ? (
							<>
								<div className="border-b px-5 py-3 bg-gradient-to-r from-blue-50 to-purple-50">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
											<FaRobot className="text-white" />
										</div>
										<div>
											<h3 className="font-semibold text-slate-900">AI Assistant</h3>
											<p className="text-xs text-slate-500">Ask me about your students</p>
										</div>
									</div>
								</div>

								<div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
									{(!messagesStore['ai-assistant'] || messagesStore['ai-assistant'].length === 0) ? (
										<div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
											<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
												<FaRobot className="text-3xl text-blue-600" />
											</div>
											<h4 className="mb-2 text-lg font-semibold text-slate-900">Welcome to AI Assistant</h4>
											<p className="mb-4 text-sm text-slate-600">
												Ask me about your students' performance, attendance, behavior, and more!
											</p>
											<div className="space-y-2">
												<p className="text-xs font-medium text-slate-700">Try asking:</p>
												{aiSuggestions.slice(0, 3).map((suggestion, idx) => (
													<button
														key={idx}
														onClick={() => setText(suggestion)}
														className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition"
													>
														"{suggestion}"
													</button>
												))}
											</div>
										</div>
									) : (
										messagesStore['ai-assistant'].map((message) => {
											const isUser = message.senderId === currentTeacher?.id;
											return (
												<div
													key={message.id}
													className={`flex ${isUser ? "justify-end" : "justify-start"}`}
												>
													<div
														className={`max-w-[85%] rounded-xl px-4 py-3 ${
															isUser
																? "bg-blue-600 text-white"
																: "border bg-white text-slate-900"
														}`}
													>
														{message.isAI ? (
															<div className="space-y-2">
																{/* Parse and format the markdown-style response */}
																{message.text.split('\n').map((line, idx) => {
																	// Headers with **text**
																	if (line.match(/^\*\*(.+?)\*\*$/)) {
																		const text = line.replace(/\*\*/g, '');
																		return (
																			<h3 key={idx} className="text-lg font-bold text-slate-800 mt-4 mb-2">
																				{text}
																			</h3>
																		);
																	}
																	// Bold inline text **text:**
																	if (line.match(/^\*\*(.+?):\*\*/) || line.match(/^\*\*(.+?)\*\*/)) {
																		const text = line.replace(/\*\*/g, '');
																		return (
																			<p key={idx} className="font-semibold text-slate-800 mt-3 mb-1">
																				{text}
																			</p>
																		);
																	}
																	// Table rows (detect by | separators)
																	if (line.includes('|') && line.trim().startsWith('|')) {
																		const cells = line.split('|').filter(cell => cell.trim() !== '');
																		const isHeaderSeparator = cells.every(cell => cell.trim().match(/^[-:]+$/));
																		
																		if (isHeaderSeparator) {
																			return null; // Skip separator rows
																		}
																		
																		// Check if this is a header row (first table row)
																		const isHeader = cells.some(cell => 
																			cell.trim().match(/^(Field|Metric|Type|Factor|#|Student Name|Class)/i)
																		);
																		
																		return (
																			<div key={idx} className="flex border-b border-slate-200 py-1">
																				{cells.map((cell, cellIdx) => (
																					<div 
																						key={cellIdx} 
																						className={`flex-1 px-2 text-sm ${
																							isHeader 
																								? 'font-bold text-slate-900 bg-slate-100' 
																								: 'text-slate-700'
																						} ${cellIdx === 0 ? 'min-w-[40px]' : ''}`}
																					>
																						{cell.trim()}
																					</div>
																				))}
																			</div>
																		);
																	}
																	// List items starting with •
																	if (line.trim().startsWith('•')) {
																		return (
																			<div key={idx} className="flex gap-2 ml-2 my-1">
																				<span className="text-blue-500 font-bold mt-0.5">•</span>
																				<span className="text-slate-700 flex-1">{line.trim().substring(1).trim()}</span>
																			</div>
																		);
																	}
																	// Numbered list items
																	if (line.match(/^\d+\.\s/)) {
																		const parts = line.split('**');
																		return (
																			<div key={idx} className="ml-2 mb-2">
																				<div className="flex gap-2">
																					<span className="font-semibold text-blue-600">{line.match(/^\d+\./)[0]}</span>
																					<span className="font-semibold text-slate-800">
																						{parts[1] || line.substring(line.indexOf('.') + 1).trim()}
																					</span>
																				</div>
																			</div>
																		);
																	}
																	// Sub-items with indentation (Roll, Attendance, etc.)
																	if (line.trim().startsWith('   •')) {
																		return (
																			<div key={idx} className="flex gap-2 ml-8 text-sm my-1">
																				<span className="text-slate-400 mt-0.5">•</span>
																				<span className="text-slate-600 flex-1">{line.trim().substring(1).trim()}</span>
																			</div>
																		);
																	}
																	// Empty lines
																	if (line.trim() === '') {
																		return <div key={idx} className="h-2"></div>;
																	}
																	// Regular text
																	return (
																		<p key={idx} className="text-slate-700 leading-relaxed">
																			{line}
																		</p>
																	);
																})}
																
																{/* Show confirmation buttons if needed */}
																{message.needsConfirmation && (
																	<div className="mt-4 flex gap-2 border-t pt-3">
																		<button
																			onClick={() => {
																				setText('yes');
																				handleAIQuery();
																			}}
																			className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
																		>
																			Yes, proceed
																		</button>
																		<button
																			onClick={() => {
																				setText('no');
																				handleAIQuery();
																			}}
																			className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
																		>
																			No, cancel
																		</button>
																	</div>
																)}
															</div>
														) : (
															<p className="whitespace-pre-wrap text-sm">{message.text}</p>
														)}

														<p
															className={`mt-2 text-[10px] ${
																isUser ? "text-blue-100" : "text-slate-500"
															}`}
														>
															{fmtTime(message.createdAt)}
														</p>
													</div>
												</div>
											);
										})
									)}
									{aiLoading && (
										<div className="flex justify-start">
											<div className="rounded-xl border bg-white px-4 py-3">
												<div className="flex items-center gap-2">
													<div className="flex gap-1">
														<div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0ms' }}></div>
														<div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '150ms' }}></div>
														<div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '300ms' }}></div>
													</div>
													<span className="text-xs text-slate-500">AI is thinking...</span>
												</div>
											</div>
										</div>
									)}
									<div ref={bottomRef} />
								</div>

								<div className="border-t p-3">
									<div className="mb-2 flex flex-wrap gap-2">
										{aiSuggestions.map((suggestion, idx) => (
											<button
												key={idx}
												onClick={() => setText(suggestion)}
												className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition"
											>
												{suggestion}
											</button>
										))}
									</div>

									<div className="flex gap-2">
										<input
											type="text"
											value={text}
											onChange={(e) => setText(e.target.value)}
											placeholder="Ask about a student... (e.g., 'Report of John Doe 8A')"
											className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													sendMessage();
												}
											}}
										/>

										<button
											onClick={sendMessage}
											disabled={sending || !text.trim()}
											className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
										>
											<FaPaperPlane /> Ask
										</button>
									</div>
								</div>
							</>
						) : selectedFaculty ? (
							<>
								<div className="border-b px-5 py-3">
									<h3 className="font-semibold text-slate-900">{selectedFaculty.name}</h3>
									<p className="text-xs text-slate-500">{selectedFaculty.email}</p>
								</div>

								<div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
									{currentMessages.length === 0 ? (
										<div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
											Start the conversation with {selectedFaculty.name}.
										</div>
									) : (
										currentMessages.map((message) => {
											const mine = message.senderId === currentTeacher?.id;
											return (
												<div
													key={message.id}
													className={`flex ${mine ? "justify-end" : "justify-start"}`}
												>
													<div
														className={`max-w-[78%] rounded-xl px-3 py-2 ${
															mine
																? "bg-blue-600 text-white"
																: "border bg-white text-slate-900"
														}`}
													>
														{message.text ? (
															<p className="whitespace-pre-wrap text-sm">{message.text}</p>
														) : null}

														{message.attachment ? (
															<a
																href={message.attachment.dataUrl}
																download={message.attachment.name}
																className={`mt-2 flex items-center gap-2 rounded-lg px-2 py-1 text-xs ${
																	mine
																		? "bg-blue-500/60 text-white"
																		: "bg-slate-100 text-slate-700"
																}`}
															>
																{message.attachment.type.includes("pdf") ? (
																	<FaFilePdf />
																) : (
																	<FaFileAlt />
																)}
																<span className="truncate">
																	{message.attachment.name}
																</span>
															</a>
														) : null}

														<p
															className={`mt-1 text-[10px] ${
																mine ? "text-blue-100" : "text-slate-500"
															}`}
														>
															{fmtTime(message.createdAt)}
														</p>
													</div>
												</div>
											);
										})
									)}
									<div ref={bottomRef} />
								</div>

								<div className="border-t p-3">
									{attachmentDraft ? (
										<div className="mb-2 flex items-center justify-between rounded-lg border bg-slate-50 px-3 py-2 text-xs text-slate-700">
											<span className="truncate">
												Attached: {attachmentDraft.name} (
												{Math.ceil(attachmentDraft.size / 1024)} KB)
											</span>
											<button
												onClick={() => setAttachmentDraft(null)}
												className="rounded px-2 py-1 text-slate-600 hover:bg-slate-200"
											>
												Remove
											</button>
										</div>
									) : null}

									<div className="flex gap-2">
										<input
											type="text"
											value={text}
											onChange={(e) => setText(e.target.value)}
											placeholder="Type a message"
											className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													sendMessage();
												}
											}}
										/>

										<input
											ref={fileInputRef}
											type="file"
											className="hidden"
											accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
											onChange={onChooseFile}
										/>

										<button
											type="button"
											onClick={() => fileInputRef.current?.click()}
											className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50"
											title="Attach file"
										>
											<FaPaperclip />
										</button>

										<button
											onClick={sendMessage}
											disabled={sending || (!text.trim() && !attachmentDraft)}
											className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
										>
											<FaPaperPlane /> Send
										</button>
									</div>
								</div>
							</>
						) : (
							<div className="flex h-full items-center justify-center p-6 text-center text-slate-500">
								<div>
									<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
										<FaUserFriends className="text-2xl" />
									</div>
									<p className="mb-2 font-medium">No conversation selected</p>
									<p className="text-sm">Select a faculty member or use AI Assistant to get started</p>
								</div>
							</div>
						)}
					</section>
				</div>
			</div>
		</div>
	);
}
