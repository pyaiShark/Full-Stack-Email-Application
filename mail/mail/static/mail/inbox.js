document.addEventListener("DOMContentLoaded", function () {
    // Initialize animations
    initializeAnimations();

    // Use buttons to toggle between views
    document.querySelector("#inbox").addEventListener("click", () => load_mailbox("inbox"));
    document.querySelector("#sent").addEventListener("click", () => load_mailbox("sent"));
    document.querySelector("#trash").addEventListener("click", () => load_mailbox("trash"));
    document.querySelector("#archived").addEventListener("click", () => load_mailbox("archive"));
    document.querySelector("#compose").addEventListener("click", compose_email);

    document.querySelector("#compose-form").addEventListener("submit", send_mail);

    // By default, load the inbox
    load_mailbox("inbox");
});

function initializeAnimations() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
            `;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

function compose_email() {
    // Show compose view and hide other views with animation
    document.querySelectorAll("#emails-view, #view-email").forEach(view => {
        view.style.animation = 'fadeInUp 0.3s ease reverse';
        setTimeout(() => {
            view.style.display = "none";
            view.style.animation = '';
        }, 300);
    });

    document.querySelector("#compose-view").style.display = "block";
    document.querySelector("#compose-view").style.animation = 'fadeInUp 0.5s ease';

    // Clear out composition fields
    document.querySelector("#compose-recipients").value = "";
    document.querySelector("#compose-subject").value = "";
    document.querySelector("#compose-body").value = "";

    // Focus on recipients field
    setTimeout(() => {
        document.querySelector("#compose-recipients").focus();
    }, 500);
}

function load_mailbox(mailbox) {
    // Show loading animation
    const emailsView = document.querySelector("#emails-view");
    emailsView.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
    emailsView.style.display = "block";
    emailsView.style.animation = 'fadeInUp 0.5s ease';

    // Hide other views
    document.querySelector("#view-email").style.display = "none";
    document.querySelector("#compose-view").style.display = "none";

    let route = "emails";
    if (mailbox === 'trash') {
        route = 'trash';
        mailbox = '';
    }

    // Show the mailbox name with gradient
    setTimeout(() => {
        emailsView.innerHTML = `
            <div class="glass-card">
                <h3 class="gradient-text" style="margin-bottom: 0">
                    ${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}
                </h3>
            </div>
        `;

        fetch(`/${route}/${mailbox}`)
            .then((response) => response.json())
            .then((emails) => {
                if (emails.length === 0) {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'glass-card text-center';
                    if (route === 'trash') {
                        mailbox = 'Trash';
                    }
                    emptyMessage.innerHTML = `
                        <i class="fas fa-inbox fa-3x mb-3" style="opacity: 0.3"></i>
                        <h5>No emails in ${mailbox}</h5>
                        <p class="text-muted">Your ${mailbox} is empty</p>
                    `;
                    emailsView.appendChild(emptyMessage);
                    return;
                }

                emails.forEach((email, index) => {
                    const element = document.createElement("div");
                    element.className = `mails ${email.read ? 'read' : 'unread'} hover-lift`;
                    element.style.animationDelay = `${index * 0.1}s`;
                    element.style.opacity = '0';
                    element.style.animation = 'slideInRight 0.5s ease forwards';

                    element.innerHTML = `
                        <strong>${email.sender}</strong>
                        <span style="flex: 1">${email.subject}</span>
                        <data>${email.timestamp}</data>
                        ${!email.read ? '<i class="fas fa-circle" style="color: #667eea; font-size: 0.8rem;"></i>' : ''}
                    `;

                    element.addEventListener("click", function (event) {
                        event.preventDefault();
                        this.style.animation = 'pulse 0.3s ease';
                        setTimeout(() => {
                            get_email(email.id, mailbox);
                        }, 300);
                    });

                    emailsView.appendChild(element);
                });
            })
            .catch((error) => {
                console.log(error);
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert alert-danger';
                errorMessage.textContent = 'Failed to load emails. Please try again.';
                emailsView.appendChild(errorMessage);
            });
    }, 500);
}

function send_mail(event) {
    event.preventDefault();

    const recipients = document.querySelector("#compose-recipients").value;
    const subject = document.querySelector("#compose-subject").value;
    const body = document.querySelector("#compose-body").value;

    // Add loading state to submit button
    const submitBtn = document.querySelector("#compose-form input[type='submit']");
    const originalText = submitBtn.value;
    submitBtn.value = 'Sending...';
    submitBtn.disabled = true;

    fetch("/emails", {
        method: "POST",
        body: JSON.stringify({
            recipients: recipients,
            subject: subject,
            body: body,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to send email');
            }
            return response.json();
        })
        .then((result) => {
            // Show success message
            const successMessage = document.createElement('div');
            window.scroll(0, 0);
            successMessage.className = 'alert alert-success';
            successMessage.textContent = 'Email sent successfully!';
            successMessage.style.animation = 'fadeInUp 0.5s ease';
            document.querySelector("#compose-view").prepend(successMessage);

            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.style.animation = 'fadeInUp 0.5s ease reverse';
                setTimeout(() => successMessage.remove(), 500);
            }, 3000);

            // Load sent mailbox
            setTimeout(() => {
                load_mailbox("sent");
            }, 1500);
        })
        .catch((error) => {
            console.log(error);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger';
            errorMessage.textContent = 'Failed to send email. Please try again.';
            errorMessage.style.animation = 'fadeInUp 0.5s ease';
            document.querySelector("#compose-view").prepend(errorMessage);

            // Remove error message after 5 seconds
            setTimeout(() => {
                errorMessage.style.animation = 'fadeInUp 0.5s ease reverse';
                setTimeout(() => errorMessage.remove(), 500);
            }, 5000);
        })
        .finally(() => {
            submitBtn.value = originalText;
            submitBtn.disabled = false;
        });
}

function get_email(email_id, mailbox) {
    const viewEmail = document.querySelector('#view-email');
    viewEmail.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    viewEmail.style.display = "block";
    viewEmail.style.animation = 'fadeInUp 0.5s ease';

    document.querySelector("#emails-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "none";

    fetch(`/emails/${email_id}`)
        .then((response) => response.json())
        .then((data) => {
            setTimeout(() => {
                viewEmail.innerHTML = '';

                // Create email container
                const emailContainer = document.createElement('div');
                emailContainer.className = 'glass-card';
                emailContainer.style.animation = 'fadeInUp 0.5s ease';

                // Create archive/unarchive button
                let archiveButton = '';
                if (mailbox !== 'sent') {
                    archiveButton = `
                        <button class="btn ${data.archived ? 'btn-success' : 'btn-outline-success'} email-archive-btn" 
                                style="position: absolute; top: 30px; right: 30px;">
                            <i class="fas fa-${data.archived ? 'inbox' : 'archive'}"></i>
                            ${data.archived ? 'Unarchive' : 'Archive'}
                        </button>
                    `;
                }

                emailContainer.innerHTML = `
                    ${archiveButton}
                    <div class="email-header">
                        <div class="email-meta">
                            <div>
                                <strong>From</strong>
                                <span>${data.sender}</span>
                            </div>
                            <div>
                                <strong>To</strong>
                                <span>${data.recipients}</span>
                            </div>
                            <div>
                                <strong>Subject</strong>
                                <span>${data.subject}</span>
                            </div>
                            <div>
                                <strong>Timestamp</strong>
                                <span>${data.timestamp}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="email-body">
                        <pre>${data.body}</pre>
                    </div>
                    
                    <div class="email-actions">
                        <button class="btn btn-primary replay-btn">
                            <i class="fas fa-reply"></i> Reply
                        </button>
                        <button class="btn btn-outline-primary">
                            <i class="fas fa-forward"></i> Forward
                        </button>
                        <button class="btn btn-outline-danger delete-btn">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                `;

                viewEmail.appendChild(emailContainer);

                // Add event listeners
                const archiveBtn = document.querySelector('.email-archive-btn');
                if (archiveBtn) {
                    archiveBtn.addEventListener('click', function (event) {
                        event.preventDefault();
                        this.classList.add('processing');
                        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                        archive(email_id, data.archived);
                    });
                }

                document.querySelector('.replay-btn').addEventListener('click', function (event) {
                    event.preventDefault();
                    replay(data.sender, data.subject, data.body, data.timestamp);
                });

                // document.querySelector('.fa-forward').addEventListener('click', function (event) {
                //     event.preventDefault();
                //     forward(data); TODO: Complete latter
                // });
                document.querySelector('.delete-btn').addEventListener('click', function (event) {
                    event.preventDefault();
                    showSingleDeleteConfirmation(data.trashed, email_id)
                });

                // Mark as read if not read
                if (!data.read) {
                    fetch(`/emails/${email_id}`, {
                        method: "PUT",
                        body: JSON.stringify({
                            read: true
                        })
                    }).catch(error => console.log(error));
                }
            }, 500);
        })
        .catch(error => {
            console.log(error);
            viewEmail.innerHTML = `
                <div class="alert alert-danger">
                    Failed to load email. Please try again.
                </div>
            `;
        });
}

function archive(email_id, isArchived) {
    const action = isArchived ? false : true;

    fetch(`/emails/${email_id}`, {
        method: "PUT",
        body: JSON.stringify({
            archived: action
        })
    })
        .then(response => {
            if (response.status === 204) {
                // Show success feedback
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success';
                successMessage.textContent = `Email ${isArchived ? 'unarchived' : 'archived'} successfully!`;
                successMessage.style.position = 'fixed';
                successMessage.style.top = '20px';
                successMessage.style.right = '20px';
                successMessage.style.zIndex = '1000';
                successMessage.style.animation = 'fadeInUp 0.5s ease';
                document.body.appendChild(successMessage);

                setTimeout(() => {
                    successMessage.style.animation = 'fadeInUp 0.5s ease reverse';
                    setTimeout(() => successMessage.remove(), 500);
                }, 3000);

                // Load inbox after delay
                setTimeout(() => {
                    load_mailbox('inbox');
                }, 1000);
            }
        })
        .catch(error => console.log(error));
}

function replay(sender, subject, body, timestamp) {
    compose_email();
    document.querySelector("#compose-recipients").value = sender;
    const sub = document.querySelector("#compose-subject");
    if (subject.slice(0, 3) === 'Re:') {
        sub.value = subject;
    } else {
        sub.value = `Re: ${subject}`
    }
    document.querySelector("#compose-body").value = `On ${timestamp} ${sender} wrote:\n${body}---------------------------------------------------\n`;

    // Focus on body
    setTimeout(() => {
        document.querySelector("#compose-body").focus();
        document.querySelector("#compose-body").selectionStart = 0;
        document.querySelector("#compose-body").selectionEnd = 0;
    }, 500);
}

function deleteEmail(trashed, email_id) {
    let route = "trashed";
    let m = 'PUT';
    if (trashed) {
        route = 'delete';
        m = 'DELETE';
    }
    fetch(`/${route}/${email_id}`, {
        method: m,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
        .then(response => {
            if (response.ok) {
                // Remove item from DOM
                const itemElement = document.querySelector(`[data-id="${email_id}"]`);
                if (itemElement) {
                    itemElement.remove();
                }

                // Show success feedback
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success';
                successMessage.textContent = `Email ${!trashed ? 'added to trash' : 'deleted successfully!'} `;
                successMessage.style.position = 'fixed';
                successMessage.style.top = '20px';
                successMessage.style.right = '20px';
                successMessage.style.zIndex = '1000';
                successMessage.style.animation = 'fadeInUp 0.5s ease';
                document.body.appendChild(successMessage);

                setTimeout(() => {
                    successMessage.style.animation = 'fadeInUp 0.5s ease reverse';
                    setTimeout(() => successMessage.remove(), 500);
                }, 3000);
                setTimeout(() => load_mailbox("inbox"), 1000);
            } else {
                throw new Error('Delete failed');
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function showSingleDeleteConfirmation(trashed, emailId) {
    const modal = document.getElementById('singleDeleteConfirmationModal');
    modal.classList.add('active');
    document.getElementById('view-email').classList.add('active');

    // Set up confirm button
    document.getElementById('confirmSingleDeleteBtn').onclick = function () {
        deleteEmail(trashed, emailId);
        modal.classList.remove('active');
        document.getElementById('view-email').classList.remove('active');
    };

    // Set up cancel button
    document.getElementById('cancelSingleDeleteBtn').onclick = function () {
        modal.classList.remove('active');
        document.getElementById('view-email').classList.remove('active');
    };
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}