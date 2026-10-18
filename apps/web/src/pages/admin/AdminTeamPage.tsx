import React, { useState, useEffect } from 'react';
import { teamService, StaffMember, RoleGroup } from '../../services/teamService.js';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  MessageSquare,
  Shield,
  Sparkles,
  RotateCcw,
  Search,
  ExternalLink,
} from 'lucide-react';

interface AdminTeamPageProps {
  token: string;
}

export const AdminTeamPage: React.FC<AdminTeamPageProps> = () => {
  const [roleGroups, setRoleGroups] = useState<RoleGroup[]>([]);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<{ member: StaffMember; groupId: string } | null>(null);

  // Form Fields
  const [ign, setIgn] = useState('');
  const [skinUsername, setSkinUsername] = useState('');
  const [roleGroupTitle, setRoleGroupTitle] = useState('OWNER');
  const [discordTag, setDiscordTag] = useState('');
  const [hasChat, setHasChat] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTeam = () => {
    setRoleGroups(teamService.getTeam());
  };

  useEffect(() => {
    loadTeam();
    const handleUpdate = () => loadTeam();
    window.addEventListener('anajaksmp_team_updated', handleUpdate);
    return () => window.removeEventListener('anajaksmp_team_updated', handleUpdate);
  }, []);

  const openCreateModal = () => {
    setEditingMember(null);
    setIgn('');
    setSkinUsername('');
    setRoleGroupTitle(roleGroups[0]?.title || 'OWNER');
    setDiscordTag('');
    setHasChat(true);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: StaffMember, groupId: string, groupTitle: string) => {
    setEditingMember({ member, groupId });
    setIgn(member.ign);
    setSkinUsername(member.skinUsername);
    setRoleGroupTitle(groupTitle);
    setDiscordTag(member.discordTag);
    setHasChat(member.hasChat ?? true);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ign.trim()) {
      setError('In-Game Username (IGN) is required.');
      return;
    }
    if (!roleGroupTitle.trim()) {
      setError('Role Group title is required.');
      return;
    }

    const effectiveSkin = skinUsername.trim() || ign.trim();
    const formattedGroup = roleGroupTitle.trim().toUpperCase();

    if (editingMember) {
      teamService.updateMember(
        editingMember.member.id,
        {
          ign: ign.trim(),
          skinUsername: effectiveSkin,
          discordTag: discordTag.trim() || ign.trim(),
          hasChat,
        },
        formattedGroup.toLowerCase()
      );
    } else {
      teamService.addMember(formattedGroup.toLowerCase(), {
        ign: ign.trim(),
        skinUsername: effectiveSkin,
        discordTag: discordTag.trim() || ign.trim(),
        hasChat,
      });
    }

    setIsModalOpen(false);
    loadTeam();
  };

  const handleDelete = (member: StaffMember) => {
    if (!window.confirm(`Are you sure you want to remove staff member "${member.ign}"?`)) return;
    teamService.deleteMember(member.id);
    loadTeam();
  };

  const handleResetDefault = () => {
    if (window.confirm('Reset all staff members back to default AnajakSMP team?')) {
      teamService.resetToDefault();
      loadTeam();
    }
  };

  // Filter members
  const filteredGroups = roleGroups
    .map((group) => ({
      ...group,
      members: group.members.filter(
        (m) =>
          m.ign.toLowerCase().includes(search.toLowerCase()) ||
          m.discordTag.toLowerCase().includes(search.toLowerCase()) ||
          group.title.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((group) => group.members.length > 0 || !search);

  const totalMembers = roleGroups.reduce((acc, g) => acc + g.members.length, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white">Staff Team Management</h1>
            <span className="bg-gold/15 text-gold text-xs px-2.5 py-0.5 rounded-full font-bold border border-gold/30">
              {totalMembers} Staff Members
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Add, update roles, manage Discord tags, and set 3D Minecraft skin renders displayed on /team.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleResetDefault}
            title="Reset team to initial configuration"
            className="p-2.5 rounded-xl bg-brand-secondary border border-brand-border text-text-secondary hover:text-white hover:border-gold/50 transition-colors text-xs font-bold flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={openCreateModal}
            className="gold-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-gold-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-brand-secondary rounded-xl border border-brand-border flex items-center max-w-sm">
        <Search className="w-4 h-4 text-text-muted mr-2" />
        <input
          type="text"
          placeholder="Filter by IGN, role, discord..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-xs text-white placeholder-text-muted focus:outline-none w-full"
        />
      </div>

      {/* Role Groups & Members */}
      <div className="space-y-6">
        {filteredGroups.map((group) => (
          <div key={group.id} className="rounded-2xl bg-brand-card border border-brand-border p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
                <h3 className="font-minecraft text-sm font-black text-gold uppercase tracking-wider">
                  {group.title}
                </h3>
                <span className="text-xs text-text-secondary font-mono">({group.members.length})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-xl bg-brand-secondary/80 border border-brand-border p-4 flex items-center space-x-4 hover:border-gold/40 transition-all group"
                >
                  {/* Skin Avatar (Visage 3D front) */}
                  <div className="w-16 h-20 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                    <img
                      src={`https://visage.surgeplay.com/front/120/${member.skinUsername || member.ign}`}
                      alt={member.ign}
                      className="w-14 h-auto object-contain filter drop-shadow hover:scale-110 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://mc-heads.net/avatar/${member.ign}/64`;
                      }}
                    />
                  </div>

                  {/* Member Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-sm text-white truncate font-minecraft">{member.ign}</h4>
                      {member.hasChat && (
                        <span title="Chat enabled">
                          <MessageSquare className="w-3.5 h-3.5 text-[#FFE600]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary truncate font-mono">
                      Discord: <span className="text-white/80">{member.discordTag}</span>
                    </p>
                    <p className="text-[11px] text-text-muted truncate">
                      Skin: {member.skinUsername || member.ign}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 pt-2">
                      <button
                        onClick={() => openEditModal(member, group.id, group.title)}
                        className="px-2.5 py-1 rounded-lg bg-brand-card hover:bg-gold hover:text-brand-bg border border-brand-border text-text-secondary text-xs font-bold flex items-center space-x-1 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(member)}
                        className="px-2.5 py-1 rounded-lg bg-brand-card hover:bg-status-error hover:text-white border border-brand-border text-text-secondary text-xs font-bold flex items-center space-x-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="py-16 text-center text-text-secondary bg-brand-card rounded-2xl border border-brand-border p-8">
            <Users className="w-10 h-10 text-gold/50 mx-auto mb-3" />
            <p className="font-bold text-white text-sm">No staff members found.</p>
            <p className="text-xs text-text-secondary mt-1">Click "Add Team Member" above to create one.</p>
          </div>
        )}
      </div>

      {/* Create / Edit Staff Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div
            className="relative w-full max-w-lg bg-brand-card border border-brand-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-scaleUp text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-secondary">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {editingMember ? 'Edit Staff Member' : 'Add New Staff Member'}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Configure staff details and live 3D Minecraft skin
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-brand-card border border-brand-border text-text-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              {error && (
                <div className="p-3 rounded-xl bg-status-error/15 border border-status-error/40 text-xs text-status-error">
                  {error}
                </div>
              )}

              {/* Live Skin Preview */}
              <div className="p-3.5 rounded-2xl bg-brand-secondary border border-brand-border flex items-center space-x-4">
                <div className="w-16 h-20 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  <img
                    src={`https://visage.surgeplay.com/front/120/${skinUsername.trim() || ign.trim() || 'Steve'}`}
                    alt="Skin Preview"
                    className="w-14 h-auto object-contain filter drop-shadow"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://mc-heads.net/avatar/${ign || 'Steve'}/64`;
                    }}
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold block">
                    Minecraft 3D Skin Preview
                  </span>
                  <p className="text-white font-bold text-xs mt-0.5">
                    {ign.trim() || 'Player Name'}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Skin source: {skinUsername.trim() || ign.trim() || 'Steve'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">
                    In-Game Name (IGN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    placeholder="e.g. _T_Z or Nx4YGzz"
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">
                    Skin Username (For 3D Render)
                  </label>
                  <input
                    type="text"
                    value={skinUsername}
                    onChange={(e) => setSkinUsername(e.target.value)}
                    placeholder="Same as IGN if blank"
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">
                    Role Group *
                  </label>
                  <input
                    type="text"
                    required
                    value={roleGroupTitle}
                    onChange={(e) => setRoleGroupTitle(e.target.value)}
                    placeholder="OWNER, DEVELOPER, BUILDER, MODERATOR..."
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold uppercase"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['OWNER', 'DEVELOPER', 'BUILDER', 'MODERATOR', 'HELPER', 'ADMIN'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRoleGroupTitle(r)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                          roleGroupTitle.toUpperCase() === r
                            ? 'bg-gold text-brand-bg border-gold'
                            : 'bg-brand-secondary text-text-secondary border-brand-border hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block uppercase font-bold text-text-secondary mb-1">
                    Discord Tag
                  </label>
                  <input
                    type="text"
                    value={discordTag}
                    onChange={(e) => setDiscordTag(e.target.value)}
                    placeholder="e.g. Nx4YGzz or user#1234"
                    className="w-full bg-brand-secondary border border-brand-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-brand-secondary border border-brand-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Chat / Contact Allowed</span>
                  <span className="text-[11px] text-text-muted">
                    Show chat icon badge indicating this staff member is reachable
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={hasChat}
                  onChange={(e) => setHasChat(e.target.checked)}
                  className="w-4 h-4 rounded text-gold bg-brand-card border-brand-border focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-brand-secondary border border-brand-border text-text-secondary hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold shadow-gold-glow flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingMember ? 'Save Changes' : 'Add Staff Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
