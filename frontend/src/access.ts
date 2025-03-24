export default function access(initialState: { currentUser?: API.CurrentUser }) {
  const { currentUser } = initialState || {};
  
  return {
    isAdmin: currentUser && currentUser.role === 'admin',
    isJudge: currentUser && currentUser.role === 'judge',
    isCompetitor: currentUser && currentUser.role === 'competitor',
    isStaff: currentUser && currentUser.role === 'staff',
  };
} 