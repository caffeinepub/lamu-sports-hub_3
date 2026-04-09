import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  useAddOfficial,
  useAddReferee,
  useDeleteOfficial,
  useDeleteReferee,
  useOfficials,
  useReferees,
  useUpdateOfficial,
} from "../hooks/use-backend";
import type { Official, Referee } from "../types";

// ─── Static fallback ────────────────────────────────────────────────────────

const STATIC_OFFICIALS: Official[] = [
  {
    id: BigInt(0),
    name: "Said Joseph",
    role: "Founder & Lead Developer",
    phone: "+254 705 434 375",
    email: "lamusportshub@gmail.com",
    area: "Lamu Town",
  },
];

// ─── Card Components ─────────────────────────────────────────────────────────

function OfficialCard({
  official,
  canEdit,
  onEdit,
  onDelete,
}: {
  official: Official;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl border"
      style={{
        background: "oklch(var(--card) / 0.5)",
        borderColor: "oklch(var(--border) / 0.4)",
      }}
      data-ocid={`official-card-${official.id}`}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm font-display shrink-0"
        style={{
          background: "oklch(var(--primary) / 0.12)",
          color: "oklch(var(--primary))",
        }}
      >
        {official.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">
          {official.name}
        </p>
        <Badge
          variant="secondary"
          className="text-[10px] mt-0.5 h-4 px-1.5 max-w-full truncate block w-fit"
        >
          {official.role}
        </Badge>
        {official.area && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {official.area}
          </p>
        )}
        <div className="flex flex-wrap gap-3 mt-1.5">
          {official.phone && (
            <a
              href={`tel:${official.phone}`}
              className="flex items-center gap-1 text-xs"
              style={{ color: "oklch(var(--primary))" }}
              data-ocid={`official-phone-${official.id}`}
            >
              <Phone size={11} />
              {official.phone}
            </a>
          )}
          {official.email && (
            <a
              href={`mailto:${official.email}`}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              data-ocid={`official-email-${official.id}`}
            >
              <Mail size={11} />
              <span className="truncate max-w-[140px]">{official.email}</span>
            </a>
          )}
        </div>
      </div>
      {canEdit && (
        <div className="flex flex-col gap-1 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit official"
            className="text-muted-foreground/50 hover:text-foreground transition-colors p-1"
            data-ocid={`edit-official-${official.id}`}
          >
            <Pencil size={13} />
          </button>
          {official.id !== BigInt(0) && (
            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete official"
              className="text-muted-foreground/40 hover:text-destructive transition-colors p-1"
              data-ocid={`delete-official-${official.id}`}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function RefereeCard({
  referee,
  canDelete,
  onDelete,
}: {
  referee: Referee;
  canDelete: boolean;
  onDelete: () => void;
}) {
  const isActive = referee.status === "active";
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl border"
      style={{
        background: "oklch(var(--card) / 0.5)",
        borderColor: "oklch(var(--border) / 0.4)",
      }}
      data-ocid={`referee-card-${referee.id}`}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: isActive
            ? "oklch(0.52 0.18 142 / 0.12)"
            : "oklch(var(--muted) / 0.4)",
          color: isActive
            ? "oklch(0.52 0.18 142)"
            : "oklch(var(--muted-foreground))",
        }}
      >
        <UserCheck size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm text-foreground">
            {referee.name}
          </p>
          <Badge
            variant={isActive ? "default" : "secondary"}
            className="text-[10px] h-4 px-1.5"
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Lic: {referee.licenseNumber}
        </p>
        {referee.phone && (
          <a
            href={`tel:${referee.phone}`}
            className="flex items-center gap-1 text-xs mt-1"
            style={{ color: "oklch(var(--primary))" }}
          >
            <Phone size={11} />
            {referee.phone}
          </a>
        )}
        {referee.assignedMatchIds.length > 0 && (
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            {referee.assignedMatchIds.length} match(es) assigned
          </p>
        )}
      </div>
      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete referee"
          className="text-muted-foreground/40 hover:text-destructive transition-colors p-1 shrink-0"
          data-ocid={`delete-referee-${referee.id}`}
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Official Form ───────────────────────────────────────────────────────────

interface OfficialFormState {
  name: string;
  role: string;
  phone: string;
  email: string;
  area: string;
}

const EMPTY_OFFICIAL: OfficialFormState = {
  name: "",
  role: "",
  phone: "",
  email: "",
  area: "",
};

function OfficialFormFields({
  form,
  onChange,
}: {
  form: OfficialFormState;
  onChange: (field: keyof OfficialFormState, value: string) => void;
}) {
  const FIELDS: {
    label: string;
    key: keyof OfficialFormState;
    placeholder: string;
    id: string;
  }[] = [
    {
      label: "Full Name",
      key: "name",
      placeholder: "Ahmed Hassan",
      id: "off-name",
    },
    { label: "Role", key: "role", placeholder: "Chairman", id: "off-role" },
    { label: "Phone", key: "phone", placeholder: "+254...", id: "off-phone" },
    {
      label: "Email",
      key: "email",
      placeholder: "email@example.com",
      id: "off-email",
    },
    { label: "Area", key: "area", placeholder: "Lamu Town", id: "off-area" },
  ];
  return (
    <>
      {FIELDS.map((f) => (
        <div key={f.id}>
          <Label className="text-xs text-muted-foreground">{f.label}</Label>
          <Input
            value={form[f.key]}
            onChange={(e) => onChange(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="mt-1 h-9"
            data-ocid={f.id}
          />
        </div>
      ))}
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Officials() {
  const { loginStatus } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success";

  const { data: officialsData = [], isLoading: loadingOfficials } =
    useOfficials();
  const { data: refereesData = [], isLoading: loadingRefs } = useReferees();
  const addOfficial = useAddOfficial();
  const updateOfficial = useUpdateOfficial();
  const deleteOfficial = useDeleteOfficial();
  const addReferee = useAddReferee();
  const deleteReferee = useDeleteReferee();

  const [search, setSearch] = useState("");
  const [refSearch, setRefSearch] = useState("");

  // Add/Edit state
  const [showAddOfficial, setShowAddOfficial] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
  const [offForm, setOffForm] = useState<OfficialFormState>(EMPTY_OFFICIAL);

  // Referee add
  const [showAddReferee, setShowAddReferee] = useState(false);
  const [refName, setRefName] = useState("");
  const [refLicense, setRefLicense] = useState("");
  const [refPhone, setRefPhone] = useState("");

  // Merged + filtered officials
  const allOfficials = useMemo(
    () => [...STATIC_OFFICIALS, ...officialsData],
    [officialsData],
  );

  const filteredOfficials = useMemo(() => {
    if (!search.trim()) return allOfficials;
    const q = search.toLowerCase();
    return allOfficials.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.role.toLowerCase().includes(q) ||
        o.area.toLowerCase().includes(q),
    );
  }, [allOfficials, search]);

  const filteredReferees = useMemo(() => {
    if (!refSearch.trim()) return refereesData;
    const q = refSearch.toLowerCase();
    return refereesData.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.licenseNumber.toLowerCase().includes(q),
    );
  }, [refereesData, refSearch]);

  const openAdd = () => {
    setEditingOfficial(null);
    setOffForm(EMPTY_OFFICIAL);
    setShowAddOfficial(true);
  };

  const openEdit = (o: Official) => {
    setEditingOfficial(o);
    setOffForm({
      name: o.name,
      role: o.role,
      phone: o.phone,
      email: o.email,
      area: o.area,
    });
    setShowAddOfficial(true);
  };

  const handleOfficialFormChange = (
    field: keyof OfficialFormState,
    value: string,
  ) => {
    setOffForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOfficial = () => {
    if (editingOfficial) {
      updateOfficial.mutate(
        { id: editingOfficial.id, ...offForm },
        {
          onSuccess: () => {
            setShowAddOfficial(false);
            setOffForm(EMPTY_OFFICIAL);
            setEditingOfficial(null);
          },
        },
      );
    } else {
      addOfficial.mutate(offForm, {
        onSuccess: () => {
          setShowAddOfficial(false);
          setOffForm(EMPTY_OFFICIAL);
        },
      });
    }
  };

  const handleAddReferee = () => {
    addReferee.mutate(
      { name: refName, licenseNumber: refLicense, phone: refPhone },
      {
        onSuccess: () => {
          setShowAddReferee(false);
          setRefName("");
          setRefLicense("");
          setRefPhone("");
        },
      },
    );
  };

  const isPending = addOfficial.isPending || updateOfficial.isPending;

  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Shield size={20} style={{ color: "oklch(var(--primary))" }} />
            Officials & Refs
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            League management contacts
          </p>
        </div>
      </div>

      <Tabs defaultValue="officials">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="officials" className="flex-1">
            Officials
          </TabsTrigger>
          <TabsTrigger value="referees" className="flex-1">
            Referees
          </TabsTrigger>
        </TabsList>

        {/* ── Officials Tab ── */}
        <TabsContent
          value="officials"
          className="space-y-3"
          data-ocid="officials-list"
        >
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or role…"
              className="h-9 pl-8 pr-8 text-sm"
              data-ocid="officials-search"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {isLoggedIn && (
            <Button
              size="sm"
              onClick={openAdd}
              className="w-full gap-2"
              data-ocid="add-official-btn"
            >
              <Plus size={14} />
              Add Official
            </Button>
          )}

          {loadingOfficials ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[72px] rounded-xl" />
              ))}
            </div>
          ) : filteredOfficials.length === 0 ? (
            <div className="text-center py-10" data-ocid="officials-empty">
              <p className="text-sm text-muted-foreground">
                {search
                  ? "No officials match your search"
                  : "No officials registered yet"}
              </p>
            </div>
          ) : (
            filteredOfficials.map((o) => (
              <OfficialCard
                key={o.id.toString()}
                official={o}
                canEdit={isLoggedIn}
                onEdit={() => openEdit(o)}
                onDelete={() => deleteOfficial.mutate(o.id)}
              />
            ))
          )}

          {!loadingOfficials && filteredOfficials.length > 0 && (
            <p className="text-center text-[10px] text-muted-foreground/50 pt-1">
              {filteredOfficials.length} official
              {filteredOfficials.length !== 1 ? "s" : ""}
            </p>
          )}
        </TabsContent>

        {/* ── Referees Tab ── */}
        <TabsContent
          value="referees"
          className="space-y-3"
          data-ocid="referees-list"
        >
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              value={refSearch}
              onChange={(e) => setRefSearch(e.target.value)}
              placeholder="Search by name or license…"
              className="h-9 pl-8 pr-8 text-sm"
              data-ocid="referees-search"
            />
            {refSearch && (
              <button
                type="button"
                onClick={() => setRefSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {isLoggedIn && (
            <Button
              size="sm"
              onClick={() => setShowAddReferee(true)}
              className="w-full gap-2"
              data-ocid="add-referee-btn"
            >
              <Plus size={14} />
              Add Referee
            </Button>
          )}

          {loadingRefs ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[72px] rounded-xl" />
              ))}
            </div>
          ) : filteredReferees.length === 0 ? (
            <div className="text-center py-10" data-ocid="referees-empty">
              <p className="text-sm text-muted-foreground">
                {refSearch
                  ? "No referees match your search"
                  : "No referees registered yet"}
              </p>
            </div>
          ) : (
            filteredReferees.map((r) => (
              <RefereeCard
                key={r.id.toString()}
                referee={r}
                canDelete={isLoggedIn}
                onDelete={() => deleteReferee.mutate(r.id)}
              />
            ))
          )}

          {!loadingRefs && filteredReferees.length > 0 && (
            <p className="text-center text-[10px] text-muted-foreground/50 pt-1">
              {filteredReferees.length} referee
              {filteredReferees.length !== 1 ? "s" : ""}
            </p>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Add / Edit Official Dialog ── */}
      <Dialog open={showAddOfficial} onOpenChange={setShowAddOfficial}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingOfficial ? "Edit Official" : "Add Official"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <OfficialFormFields
              form={offForm}
              onChange={handleOfficialFormChange}
            />
            <Button
              onClick={handleSubmitOfficial}
              disabled={!offForm.name || !offForm.role || isPending}
              className="w-full"
              data-ocid="submit-official-btn"
            >
              {editingOfficial ? "Save Changes" : "Add Official"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Referee Dialog ── */}
      <Dialog open={showAddReferee} onOpenChange={setShowAddReferee}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Referee</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {[
              {
                label: "Full Name",
                value: refName,
                set: setRefName,
                placeholder: "Mohamed Ali",
                id: "ref-name",
              },
              {
                label: "License Number",
                value: refLicense,
                set: setRefLicense,
                placeholder: "FKF-2025-001",
                id: "ref-license",
              },
              {
                label: "Phone",
                value: refPhone,
                set: setRefPhone,
                placeholder: "+254...",
                id: "ref-phone",
              },
            ].map((f) => (
              <div key={f.id}>
                <Label className="text-xs text-muted-foreground">
                  {f.label}
                </Label>
                <Input
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  className="mt-1 h-9"
                  data-ocid={f.id}
                />
              </div>
            ))}
            <Button
              onClick={handleAddReferee}
              disabled={!refName || !refLicense || addReferee.isPending}
              className="w-full"
              data-ocid="submit-add-referee"
            >
              Add Referee
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
