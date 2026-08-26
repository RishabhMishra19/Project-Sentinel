// import React, { useState } from "react";
// import { getLoadTestById, deleteLoadTestOrData } from "../services/ApiManager";

// export default function CleanupPage() {
//     const [loadTestId, setLoadTestId] = useState("");
//     const [loadTest, setLoadTest] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");

//     const handlePreview = async (e) => {
//         e.preventDefault();
//         if (!loadTestId) return;
//         setLoading(true);
//         setMessage("");
//         try {
//             const testData = await getLoadTestById(loadTestId).catch(
//                 () => null,
//             );
//             setLoadTest(testData);
//         } catch (err) {
//             setMessage(`Error: ${err.message}`);
//             setLoadTest(null);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async () => {
//         if (
//             !window.confirm(
//                 "Are you sure you want to delete this test and its related records?",
//             )
//         )
//             return;
//         setLoading(true);
//         try {
//             const success = await deleteLoadTestOrData(loadTestId);
//             if (success) {
//                 setMessage("Successfully deleted test and related entities.");
//                 setLoadTest(null);
//                 setLoadTestId("");
//             } else {
//                 setMessage("Deletion failed on the backend.");
//             }
//         } catch (err) {
//             setMessage(`Error: ${err.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div
//             style={{
//                 padding: "20px",
//                 fontFamily: "sans-serif",
//                 maxWidth: "750px",
//                 margin: "0 auto",
//             }}
//         >
//             <h2>Test Data & Load Test Cleanup</h2>
//             <p
//                 style={{
//                     color: "#666",
//                     fontSize: "14px",
//                     marginBottom: "20px",
//                 }}
//             >
//                 Preview related entities before permanent deletion to ensure
//                 safe removal.
//             </p>

//             <form
//                 onSubmit={handlePreview}
//                 style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
//             >
//                 <input
//                     type="text"
//                     placeholder="Enter Load Test ID (UUID)"
//                     value={loadTestId}
//                     onChange={(e) => setLoadTestId(e.target.value)}
//                     style={{
//                         flex: 1,
//                         padding: "10px",
//                         fontSize: "14px",
//                         borderRadius: "4px",
//                         border: "1px solid #ccc",
//                     }}
//                 />
//                 <button
//                     type="submit"
//                     disabled={loading}
//                     style={{
//                         padding: "10px 20px",
//                         background: "#dc3545",
//                         color: "white",
//                         border: "none",
//                         cursor: "pointer",
//                         borderRadius: "4px",
//                         fontWeight: "bold",
//                     }}
//                 >
//                     {loading ? "Searching..." : "Preview Deletion"}
//                 </button>
//             </form>

//             {message && (
//                 <p
//                     style={{
//                         padding: "10px",
//                         background: "#f8d7da",
//                         color: "#721c24",
//                         border: "1px solid #f5c6cb",
//                         borderRadius: "4px",
//                     }}
//                 >
//                     {message}
//                 </p>
//             )}

//             {loadTest && (
//                 <div
//                     style={{
//                         padding: "20px",
//                         background: "#f8f9fa",
//                         border: "1px solid #ddd",
//                         borderRadius: "6px",
//                         boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//                     }}
//                 >
//                     <h3
//                         style={{
//                             marginTop: 0,
//                             borderBottom: "1px solid #ddd",
//                             paddingBottom: "10px",
//                         }}
//                     >
//                         Associated Entities Preview
//                     </h3>

//                     {/* Header Info */}
//                     <div
//                         style={{
//                             background: "#e9ecef",
//                             padding: "12px",
//                             borderRadius: "4px",
//                             marginBottom: "15px",
//                             textAlign: "left",
//                         }}
//                     >
//                         <p style={{ margin: "4px 0" }}>
//                             <strong>Load Test Name:</strong> {loadTest.name}
//                         </p>
//                         <p style={{ margin: "4px 0" }}>
//                             <strong>Test Data ID:</strong> {loadTest.id}
//                         </p>
//                         <p style={{ margin: "4px 0" }}>
//                             <strong>Status:</strong> {loadTest.status}
//                         </p>
//                     </div>

//                     {/* Render Entity Lists */}
//                     <div
//                         style={{
//                             margin: "15px 0",
//                             maxHeight: "350px",
//                             overflowY: "auto",
//                             textAlign: "left",
//                         }}
//                     >
//                         {JSON.stringify(loadTest.associatedLoadTestData)}
//                     </div>

//                     <button
//                         onClick={handleDelete}
//                         disabled={loading}
//                         style={{
//                             width: "100%",
//                             marginTop: "20px",
//                             padding: "12px",
//                             background: "#c82333",
//                             color: "white",
//                             border: "none",
//                             cursor: "pointer",
//                             fontWeight: "bold",
//                             borderRadius: "4px",
//                             fontSize: "15px",
//                         }}
//                     >
//                         {loading ? "Deleting..." : "Confirm & Delete"}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }
