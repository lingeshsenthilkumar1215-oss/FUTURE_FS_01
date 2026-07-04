// public/script.js
const API_URL = 'http://localhost:5000/api/leads';

// Fetch and display leads on load
document.addEventListener('DOMContentLoaded', fetchLeads);

// Handle new lead submission
document.getElementById('addLeadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newLead = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        source: document.getElementById('source').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLead)
        });
        
        if (response.ok) {
            document.getElementById('addLeadForm').reset();
            fetchLeads(); // Refresh table
        }
    } catch (error) {
        console.error('Error adding lead:', error);
    }
});

// Fetch leads from backend
async function fetchLeads() {
    try {
        const response = await fetch(API_URL);
        const leads = await response.json();
        const tbody = document.getElementById('leadsBody');
        tbody.innerHTML = '';

        leads.forEach(lead => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${lead.name}</td>
                <td>${lead.email}</td>
                <td>${lead.source}</td>
                <td>
                    <select id="status-${lead._id}" class="status-${lead.status}">
                        <option value="new" ${lead.status === 'new' ? 'selected' : ''}>New</option>
                        <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="converted" ${lead.status === 'converted' ? 'selected' : ''}>Converted</option>
                    </select>
                </td>
                <td>
                    <textarea id="notes-${lead._id}" class="notes-input" placeholder="Add follow-up notes...">${lead.notes || ''}</textarea>
                </td>
                <td>
                    <button class="btn-update" onclick="updateLead('${lead._id}')">Update</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching leads:', error);
    }
}

// Update lead status and notes
async function updateLead(id) {
    const status = document.getElementById(`status-${id}`).value;
    const notes = document.getElementById(`notes-${id}`).value;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, notes })
        });
        
        if (response.ok) {
            alert('Lead updated successfully!');
            fetchLeads(); // Refresh to update status colors
        }
    } catch (error) {
        console.error('Error updating lead:', error);
    }
}