import { useState, useMemo, useCallback } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Checkbox,
  Avatar,
  Spinner,
} from '@fluentui/react-components';
import { PersonRegular, PeopleRegular } from '@fluentui/react-icons';
import { TypeBadge } from '../../components/shared/TypeBadge';
import { getAvatarColor } from '../../components/shared/avatarUtils';
import type { OwnerSponsorEntry } from '../../models/types';

const useStyles = makeStyles({
  wrapper: {
    flex: 1,
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
    borderBottom: `2px solid ${tokens.colorNeutralStroke1}`,
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      color: tokens.colorNeutralForeground1,
    },
  },
  thCheckbox: {
    width: '40px',
    padding: '8px 12px',
    borderBottom: `2px solid ${tokens.colorNeutralStroke1}`,
  },
  td: {
    padding: '8px 12px',
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    verticalAlign: 'middle',
  },
  row: {
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  rowSelected: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Selected,
    },
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  groupAvatar: {
    borderRadius: '6px 2px 6px 2px',
  },
  empty: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
    color: tokens.colorNeutralForeground3,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
  },
});

type SortField = 'name' | 'objectType';
type SortDir = 'asc' | 'desc';

interface TableProps {
  items: OwnerSponsorEntry[];
  selectedItems: OwnerSponsorEntry[];
  onSelectionChange: (items: OwnerSponsorEntry[]) => void;
  loading: boolean;
  searchTerm: string;
}

export function OwnersAndSponsorsTable({
  items,
  selectedItems,
  onSelectionChange,
  loading,
  searchTerm,
}: TableProps) {
  const styles = useStyles();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const selectedKeys = useMemo(
    () => new Set(selectedItems.map((i) => i.key)),
    [selectedItems],
  );

  const filtered = useMemo(() => {
    let list = items;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(lower) ||
          i.email.toLowerCase().includes(lower) ||
          i.type.toLowerCase().includes(lower) ||
          i.objectType.toLowerCase().includes(lower),
      );
    }
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => dir * a[sortField].localeCompare(b[sortField]));
  }, [items, searchTerm, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const allChecked =
    filtered.length > 0 && filtered.every((i) => selectedKeys.has(i.key));

  const toggleAll = useCallback(() => {
    if (allChecked) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filtered);
    }
  }, [allChecked, filtered, onSelectionChange]);

  const toggleItem = useCallback(
    (item: OwnerSponsorEntry) => {
      if (selectedKeys.has(item.key)) {
        onSelectionChange(selectedItems.filter((i) => i.key !== item.key));
      } else {
        onSelectionChange([...selectedItems, item]);
      }
    },
    [selectedItems, selectedKeys, onSelectionChange],
  );

  const sortIndicator = (field: SortField) =>
    sortField === field ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner label="Loading..." size="small" />
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className={styles.empty}>
        <Text>{searchTerm ? 'No results found.' : 'No owners or sponsors assigned.'}</Text>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thCheckbox}>
              <Checkbox
                checked={allChecked}
                onChange={toggleAll}
                aria-label="Select all"
              />
            </th>
            <th
              className={styles.th}
              style={{ width: '25%' }}
              onClick={() => handleSort('name')}
            >
              Name{sortIndicator('name')}
            </th>
            <th className={styles.th} style={{ width: '15%' }}>
              Type
            </th>
            <th
              className={styles.th}
              style={{ width: '15%' }}
              onClick={() => handleSort('objectType')}
            >
              Object Type{sortIndicator('objectType')}
            </th>
            <th className={styles.th} style={{ width: '40%' }}>
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => {
            const isSelected = selectedKeys.has(item.key);
            return (
              <tr
                key={item.key}
                className={`${styles.row} ${isSelected ? styles.rowSelected : ''}`}
              >
                <td className={styles.td}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleItem(item)}
                    aria-label={`Select ${item.name}`}
                  />
                </td>
                <td className={styles.td}>
                  <div className={styles.nameCell}>
                    {item.objectType === 'User' ? (
                      <Avatar name={item.name} size={28} color={getAvatarColor(item.name)} />
                    ) : (
                      <Avatar
                        icon={<PeopleRegular />}
                        name={item.name}
                        size={28}
                        color={getAvatarColor(item.name)}
                        className={styles.groupAvatar}
                      />
                    )}
                    <Text>{item.name}</Text>
                  </div>
                </td>
                <td className={styles.td}>
                  <TypeBadge type={item.type} />
                </td>
                <td className={styles.td}>
                  {item.objectType === 'User' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <PersonRegular fontSize={14} />
                      User
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <PeopleRegular fontSize={14} />
                      Group
                    </div>
                  )}
                </td>
                <td className={styles.td}>{item.email || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
