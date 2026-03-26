import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Save } from "lucide-react";

interface Field {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  placeholder?: string;
  rows?: number;
}

interface EditDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDelete: () => void;
  title: string;
  fields: Field[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  showDeleteConfirm: boolean;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

const inputStyle = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '1.05rem', fontWeight: 400 as const,
  color: 'hsl(222,38%,22%)', background: 'hsl(40,26%,95%)',
  border: '1px solid rgba(30,60,130,0.10)', borderRadius: '4px',
  padding: '10px 14px', outline: 'none', width: '100%',
};

const labelStyle = {
  fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700 as const,
  letterSpacing: '0.14em', textTransform: 'uppercase' as const,
  color: 'hsl(218,68%,28%)', marginBottom: '6px', display: 'block',
};

export default function EditDeleteModal({
  isOpen, onClose, onSave, onDelete, title, fields, values, onChange,
  showDeleteConfirm, onDeleteConfirm, onDeleteCancel,
}: EditDeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(10,18,42,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="w-full max-w-md"
            style={{
              background: 'hsl(42,28%,97%)',
              borderRadius: '12px 12px 0 0',
              maxHeight: '85vh',
              overflowY: 'auto',
              paddingBottom: '80px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3"
              style={{ borderBottom: '1px solid rgba(30,60,130,0.08)' }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600, fontSize: '1.2rem', color: 'hsl(222,45%,16%)',
              }}>
                {title}
              </h3>
              <button onClick={onClose} className="flex items-center justify-center"
                style={{ width: 28, height: 28, borderRadius: '4px', background: 'rgba(30,60,130,0.06)' }}>
                <X className="w-3.5 h-3.5" style={{ color: 'hsl(220,18%,50%)' }} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {showDeleteConfirm ? (
                <motion.div
                  key="delete-confirm"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="p-5 flex flex-col items-center gap-4"
                >
                  <div className="w-12 h-12 flex items-center justify-center"
                    style={{ background: 'rgba(180,40,40,0.10)', borderRadius: '50%' }}>
                    <Trash2 className="w-5 h-5" style={{ color: 'hsl(0,50%,42%)' }} />
                  </div>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: 'italic', fontSize: '1.1rem', color: 'hsl(222,38%,22%)', textAlign: 'center',
                  }}>
                    Are you sure you want to delete this?
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'hsl(220,16%,56%)', textAlign: 'center',
                  }}>
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-3 w-full mt-2">
                    <motion.button
                      onClick={onDeleteCancel}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 py-3"
                      style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        background: 'hsl(40,22%,95%)', color: 'hsl(222,30%,30%)',
                        border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px',
                      }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={onDeleteConfirm}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 py-3"
                      style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        background: 'hsl(0,50%,42%)', color: 'hsl(42,30%,96%)',
                        border: 'none', borderRadius: '4px',
                      }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="edit-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 flex flex-col gap-4"
                >
                  {fields.map(field => (
                    <div key={field.key}>
                      <label style={labelStyle}>{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={values[field.key] || ''}
                          onChange={e => onChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          rows={field.rows || 3}
                          style={{ ...inputStyle, resize: 'none' as const }}
                        />
                      ) : field.type === 'select' ? (
                        <div className="flex flex-wrap gap-1.5">
                          {field.options?.map(opt => (
                            <button key={opt} onClick={() => onChange(field.key, opt)}
                              className="transition-all duration-200"
                              style={{
                                fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600,
                                letterSpacing: '0.10em', textTransform: 'uppercase',
                                background: values[field.key] === opt ? 'hsl(218,70%,28%)' : 'hsl(40,22%,95%)',
                                color: values[field.key] === opt ? 'hsl(42,30%,94%)' : 'hsl(222,30%,30%)',
                                border: values[field.key] === opt ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.06)',
                                borderRadius: '3px', padding: '6px 12px',
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          value={values[field.key] || ''}
                          onChange={e => onChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          style={inputStyle}
                        />
                      )}
                    </div>
                  ))}

                  <div className="flex gap-3 mt-2">
                    <motion.button
                      onClick={onDelete}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center gap-2 py-3 px-4"
                      style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        background: 'rgba(180,40,40,0.08)', color: 'hsl(0,50%,42%)',
                        border: '1px solid rgba(180,40,40,0.15)', borderRadius: '4px',
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      onClick={() => onSave(values)}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 flex items-center justify-center gap-2 py-3"
                      style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,96%)',
                        border: 'none', borderRadius: '4px',
                        boxShadow: '2px 4px 12px rgba(12,25,72,0.20)',
                      }}
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Changes
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
