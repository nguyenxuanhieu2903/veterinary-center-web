/**
 * PETCARE CLINIC - DATA TABLE HELPER
 * Provides search, status filtering, multi-column sorting and pagination
 */

class DataTableHelper {
  constructor(options) {
    this.tableId = options.tableId;
    this.tbodyId = options.tbodyId;
    this.data = options.data || [];
    this.renderRow = options.renderRow;
    this.pageSize = options.pageSize || 5;
    this.currentPage = 1;
    this.searchQuery = '';
    this.filterStatus = 'all';
    this.sortKey = options.defaultSortKey || null;
    this.sortOrder = options.defaultSortOrder || 'desc'; // 'asc' | 'desc'
    this.searchFields = options.searchFields || ['id', 'name'];
    this.paginationContainerId = options.paginationContainerId || null;
    this.emptyStateMessage = options.emptyStateMessage || 'Không có dữ liệu phù hợp';

    this.init();
  }

  init() {
    this.render();
  }

  setData(newData) {
    this.data = newData;
    this.currentPage = 1;
    this.render();
  }

  setSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.currentPage = 1;
    this.render();
  }

  setFilter(status) {
    this.filterStatus = status;
    this.currentPage = 1;
    this.render();
  }

  setSort(key) {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }
    this.render();
  }

  getFilteredData() {
    return this.data.filter(item => {
      // Filter status
      if (this.filterStatus !== 'all' && item.status !== this.filterStatus) {
        return false;
      }

      // Filter search query
      if (this.searchQuery) {
        const matches = this.searchFields.some(field => {
          const val = item[field];
          return val && String(val).toLowerCase().includes(this.searchQuery);
        });
        if (!matches) return false;
      }

      return true;
    });
  }

  getSortedData(data) {
    if (!this.sortKey) return data;

    return [...data].sort((a, b) => {
      let valA = a[this.sortKey];
      let valB = b[this.sortKey];

      if (valA === undefined) valA = '';
      if (valB === undefined) valB = '';

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = String(valB).toLowerCase();
        return this.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return this.sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }

  render() {
    const tbody = document.getElementById(this.tbodyId);
    if (!tbody) return;

    const filtered = this.getFilteredData();
    const sorted = this.getSortedData(filtered);
    const totalItems = sorted.length;
    const totalPages = Math.ceil(totalItems / this.pageSize) || 1;

    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const paginatedItems = sorted.slice(startIndex, startIndex + this.pageSize);

    // Empty State Check
    if (totalItems === 0) {
      const colSpan = document.getElementById(this.tableId)?.querySelectorAll('thead th').length || 6;
      tbody.innerHTML = `
        <tr>
          <td colspan="${colSpan}" style="padding: 0;">
            <div class="table-empty-state">
              <div class="table-empty-icon">🔍</div>
              <div class="table-empty-title">Không tìm thấy dữ liệu</div>
              <div class="table-empty-text">${this.emptyStateMessage}</div>
            </div>
          </td>
        </tr>
      `;
      if (this.paginationContainerId) {
        document.getElementById(this.paginationContainerId).innerHTML = '';
      }
      return;
    }

    // Render Rows
    tbody.innerHTML = paginatedItems.map((item, idx) => this.renderRow(item, startIndex + idx + 1)).join('');

    // Render Pagination
    if (this.paginationContainerId) {
      this.renderPagination(totalItems, totalPages);
    }
  }

  renderPagination(totalItems, totalPages) {
    const container = document.getElementById(this.paginationContainerId);
    if (!container) return;

    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, totalItems);

    let html = `
      <div class="pagination-info">
        Hiển thị <strong>${start}-${end}</strong> trong tổng số <strong>${totalItems}</strong> mục
      </div>
      <div class="pagination-controls">
        <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="window.${this.tableId}Helper.goToPage(${this.currentPage - 1})">❮</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      html += `
        <button class="page-btn ${this.currentPage === i ? 'active' : ''}" onclick="window.${this.tableId}Helper.goToPage(${i})">${i}</button>
      `;
    }

    html += `
        <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="window.${this.tableId}Helper.goToPage(${this.currentPage + 1})">❯</button>
      </div>
    `;

    container.innerHTML = html;
  }

  goToPage(page) {
    this.currentPage = page;
    this.render();
  }
}

