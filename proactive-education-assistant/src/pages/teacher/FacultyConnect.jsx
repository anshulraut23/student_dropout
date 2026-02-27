import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	FaCheck,
	FaCheckCircle,
	FaClock,
	FaComments,
	FaPaperPlane,
	FaSearch,
	FaTimes,
	FaUserCheck,
	FaUserClock,
	FaUsers,
} from "react-icons/fa";
import apiService from "../../services/apiService";

export default function FacultyConnect() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [currentTeacher, setCurrentTeacher] = useState(null);
	const [teachers, setTeachers] = useState([]);
	const [incomingInvites, setIncomingInvites] = useState([]);
	const [outgoingInvites, setOutgoingInvites] = useState([]);
	const [connections, setConnections] = useState([]);
	const [actionLoading, setActionLoading] = useState(null);

	useEffect(() => {
		const loadInitialData = async () => {
			setLoading(true);
			setError("");

			try {
				// Get current user
				const meResult = await apiService.getCurrentUser();
				if (!meResult?.success || !meResult?.user) {
					throw new Error("Unable to load your profile.");
				}

				const sessionTeacher = {
					id: meResult.user.id,
					name: meResult.user.fullName,
					email: meResult.user.email,
					schoolId: meResult.user.schoolId,
					schoolName: meResult.school?.name || "My School",
					subject: meResult.user.subject || "General",
				};

				setCurrentTeacher(sessionTeacher);

				// Get school teachers
				const teachersResult = await apiService.getSchoolTeachers();
				if (teachersResult?.success) {
					setTeachers(teachersResult.teachers || []);
				}

				// Get my invites
				const invitesResult = await apiService.getMyFacultyInvites();
				if (invitesResult?.success) {
					setIncomingInvites(invitesResult.incoming || []);
					setOutgoingInvites(invitesResult.outgoing || []);
				}

				// Get accepted connections
				const connectionsResult = await apiService.getAcceptedConnections();
				if (connectionsResult?.success) {
					setConnections(connectionsResult.connections || []);
				}
			} catch (err) {
				console.error("Faculty connect load error:", err);
				setError(err.message || "Failed to load faculty list.");
			} finally {
				setLoading(false);
			}
		};

		loadInitialData();
	}, []);

	const filteredTeachers = useMemo(() => {
		const q = search.trim().toLowerCase();
		return teachers
			.filter((teacher) => teacher.id !== currentTeacher?.id)
			.filter((teacher) => {
				if (!q) return true;
				return (
					teacher.name.toLowerCase().includes(q) ||
					teacher.email.toLowerCase().includes(q) ||
					(teacher.subject || "").toLowerCase().includes(q)
				);
			})
			.sort((a, b) => a.name.localeCompare(b.name));
	}, [teachers, currentTeacher, search]);

	const getInviteStatus = (teacherId) => {
		const incoming = incomingInvites.find((inv) => inv.senderId === teacherId);
		const outgoing = outgoingInvites.find((inv) => inv.recipientId === teacherId);
		const connected = connections.find((conn) => conn.userId === teacherId);

		if (connected) return { type: "connected" };
		if (incoming) return { type: "incoming", invite: incoming };
		if (outgoing) return { type: "outgoing" };
		return { type: "none" };
	};

	const sendInvite = async (teacherId) => {
		if (actionLoading) return;

		setActionLoading(`send-${teacherId}`);
		try {
			const result = await apiService.sendFacultyInvite(teacherId);
			if (result?.success) {
				setOutgoingInvites([
					...outgoingInvites,
					{
						id: result.invitation.id,
						recipientId: teacherId,
						status: "pending",
					},
				]);
				setError("");
			} else {
				setError(result?.error || "Failed to send invitation.");
			}
		} catch (err) {
			console.error("Send invite error:", err);
			setError(err.message || "Failed to send invitation.");
		} finally {
			setActionLoading(null);
		}
	};

	const acceptInvite = async (inviteId) => {
		if (actionLoading) return;

		setActionLoading(`accept-${inviteId}`);
		try {
			const result = await apiService.acceptFacultyInvite(inviteId);
			if (result?.success) {
				const invite = incomingInvites.find((inv) => inv.id === inviteId);
				if (invite) {
					setIncomingInvites(incomingInvites.filter((inv) => inv.id !== inviteId));
					setConnections([
						...connections,
						{
							id: inviteId,
							userId: invite.senderId,
							name: invite.senderName,
							email: invite.senderEmail,
							subject: invite.senderSubject,
							status: "connected",
						},
					]);
				}
				setError("");
			} else {
				setError(result?.error || "Failed to accept invitation.");
			}
		} catch (err) {
			console.error("Accept invite error:", err);
			setError(err.message || "Failed to accept invitation.");
		} finally {
			setActionLoading(null);
		}
	};

	const rejectInvite = async (inviteId) => {
		if (actionLoading) return;

		setActionLoading(`reject-${inviteId}`);
		try {
			const result = await apiService.rejectFacultyInvite(inviteId);
			if (result?.success) {
				setIncomingInvites(incomingInvites.filter((inv) => inv.id !== inviteId));
				setError("");
			} else {
				setError(result?.error || "Failed to reject invitation.");
			}
		} catch (err) {
			console.error("Reject invite error:", err);
			setError(err.message || "Failed to reject invitation.");
		} finally {
			setActionLoading(null);
		}
	};

	const openChat = (teacher) => {
		navigate(`/faculty-chat?facultyId=${teacher.userId || teacher.id}`);
	}

	// if (loading) {
	// 	return (
	// 		<div className="min-h-screen bg-slate-100 p-6">
	// 			<div className="mx-auto max-w-6xl">
	// 				<div className="rounded-xl border bg-white p-8 text-center text-slate-600">
	// 					Loading faculty list...
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// }

	return (
		<div className="min-h-screen bg-slate-100 p-6" style={{ paddingTop: '5rem' }}>
			<div className="mx-auto max-w-6xl space-y-6">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl font-semibold text-slate-900">{t("teacher_faculty.title", "Faculty Connect")}</h1>
						<p className="mt-1 text-sm text-slate-600">
							{t("teacher_faculty.subtitle", "Send invitation, accept requests, and start secure one-to-one faculty chat.")}
						</p>
					</div>

					<button
						onClick={() => navigate("/faculty-chat")}
						className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						<FaComments /> {t("teacher_faculty.open_chat", "Open Chat")}
					</button>
				</div>

				{error && (
					<div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
						{error}
					</div>
				)}

				<div className="grid gap-4 md:grid-cols-3">
					<SummaryCard
						icon={<FaUsers className="text-blue-600" />}
						label={t("teacher_faculty.faculty_in_school", "Faculty in School")}
						value={teachers.length}
					/>
					<SummaryCard
						icon={<FaUserClock className="text-amber-600" />}
						label={t("teacher_faculty.pending_received", "Pending Received")}
						value={incomingInvites.length}
					/>
					<SummaryCard
						icon={<FaUserCheck className="text-emerald-600" />}
						label={t("teacher_faculty.connected_faculty", "Connected Faculty")}
						value={connections.length}
					/>
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					<div className="space-y-4 lg:col-span-2">
						<div className="rounded-xl border bg-white p-4">
							<label className="mb-2 block text-sm font-medium text-slate-700">
								{t("teacher_faculty.search_faculty", "Search faculty")}
							</label>
							<div className="relative">
								<FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
								<input
									type="text"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder={t("teacher_faculty.search_placeholder", "Search by name, email, subject")}
									className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
								/>
							</div>
						</div>

						<div className="rounded-xl border bg-white">
							<div className="border-b px-4 py-3">
								<h2 className="text-base font-semibold text-slate-900">
									{t("teacher_faculty.teachers_in_school", "Teachers in {{schoolName}}", { schoolName: currentTeacher?.schoolName || "School" })}
								</h2>
							</div>
							<div className="divide-y">
								{filteredTeachers.length === 0 ? (
									<div className="p-6 text-center text-sm text-slate-500">
										{t("teacher_faculty.no_faculty_matched", "No faculty matched your search.")}
									</div>
								) : (
									filteredTeachers.map((teacher) => {
										const status = getInviteStatus(teacher.id);
										const isProcessing =
											actionLoading === `send-${teacher.id}` ||
											actionLoading === `accept-${teacher.id}` ||
											actionLoading === `reject-${teacher.id}`;

										return (
											<div
												key={teacher.id}
												className="flex flex-wrap items-center justify-between gap-4 p-4"
											>
												<div>
													<h3 className="font-medium text-slate-900">{teacher.name}</h3>
													<p className="text-sm text-slate-600">{teacher.email}</p>
													<p className="text-xs text-slate-500">
														{teacher.subject || "General"}
													</p>
												</div>

												<div className="flex items-center gap-2">
													{status.type === "connected" ? (
														<>
															<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
																<FaCheckCircle /> {t("teacher_faculty.connected", "Connected")}
															</span>
															<button
																onClick={() => openChat(teacher)}
																className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
															>
																<FaComments /> {t("teacher_faculty.chat", "Chat")}
															</button>
														</>
													) : status.type === "incoming" ? (
														<span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
															<FaClock /> {t("teacher_faculty.invitation_received", "Invitation Received")}
														</span>
													) : status.type === "outgoing" ? (
														<span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
															<FaClock /> {t("teacher_faculty.invitation_sent", "Invitation Sent")}
														</span>
													) : (
														<button
															onClick={() => sendInvite(teacher.id)}
															disabled={isProcessing}
															className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-60"
														>
															<FaPaperPlane />{" "}
															{isProcessing ? t("teacher_faculty.sending", "Sending...") : t("teacher_faculty.send_invite", "Send Invite")}
														</button>
													)}
												</div>
											</div>
										);
									})
								)}
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="rounded-xl border bg-white">
							<div className="border-b px-4 py-3">
								<h2 className="text-base font-semibold text-slate-900">
									{t("teacher_faculty.incoming_invitations", "Incoming Invitations")}
								</h2>
							</div>
							<div className="divide-y">
								{incomingInvites.length === 0 ? (
									<div className="p-4 text-sm text-slate-500">{t("teacher_faculty.no_pending_invitation", "No pending invitation.")}</div>
								) : (
									incomingInvites.map((invite) => (
										<div key={invite.id} className="space-y-3 p-4">
											<div>
												<p className="text-sm font-medium text-slate-900">
													{invite.senderName}
												</p>
												<p className="text-xs text-slate-500">{invite.senderEmail}</p>
											</div>
											<div className="flex gap-2">
												<button
													onClick={() => acceptInvite(invite.id)}
													disabled={actionLoading === `accept-${invite.id}`}
													className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
												>
													<FaCheck /> {actionLoading === `accept-${invite.id}` ? "..." : t("teacher_faculty.accept", "Accept")}
												</button>
												<button
													onClick={() => rejectInvite(invite.id)}
													disabled={actionLoading === `reject-${invite.id}`}
													className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-rose-600 px-2 py-2 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-60"
												>
													<FaTimes /> {actionLoading === `reject-${invite.id}` ? "..." : t("teacher_faculty.reject", "Reject")}
												</button>
											</div>
										</div>
									))
								)}
							</div>
						</div>

						<div className="rounded-xl border bg-white">
							<div className="border-b px-4 py-3">
								<h2 className="text-base font-semibold text-slate-900">{t("teacher_faculty.sent_invitations", "Sent Invitations")}</h2>
							</div>
							<div className="divide-y">
								{outgoingInvites.length === 0 ? (
									<div className="p-4 text-sm text-slate-500">
										{t("teacher_faculty.no_sent_invite", "You have not sent any invite yet.")}
									</div>
								) : (
									outgoingInvites.map((invite) => {
										const target = teachers.find((t) => t.id === invite.recipientId);
										return (
											<div key={invite.id} className="p-4">
												<p className="text-sm font-medium text-slate-900">
													{target?.name || "Faculty"}
												</p>
													<p className="text-xs text-slate-500">{t("teacher_faculty.awaiting_acceptance", "Awaiting acceptance")}</p>
											</div>
										);
									})
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function SummaryCard({ icon, label, value }) {
	return (
		<div className="rounded-xl border bg-white p-4">
			<div className="mb-2 text-xl">{icon}</div>
			<p className="text-xs text-slate-500">{label}</p>
			<p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
		</div>
	);
}
