/*
** Annotator v1.2.6
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2013-01-21 09:43:46Z
*/

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Annotator.Plugin.AnnotateItPermissions = (function(_super) {

    __extends(AnnotateItPermissions, _super);

    function AnnotateItPermissions() {
      this._setAuthFromToken = __bind(this._setAuthFromToken, this);
      this.updateAnnotationPermissions = __bind(this.updateAnnotationPermissions, this);
      this.updatePermissionsField = __bind(this.updatePermissionsField, this);
      this.addFieldsToAnnotation = __bind(this.addFieldsToAnnotation, this);
      AnnotateItPermissions.__super__.constructor.apply(this, arguments);
    }

    AnnotateItPermissions.prototype.options = {
      showViewPermissionsCheckbox: true,
      showEditPermissionsCheckbox: true,
      groups: {
        world: 'group:__world__',
        authenticated: 'group:__authenticated__',
        consumer: 'group:__consumer__'
      },
      userId: function(user) {
        return user.userId;
      },
      userString: function(user) {
        return user.userId;
      },
      userAuthorize: function(action, annotation, user) {
        var action_field, permissions, _ref, _ref2, _ref3, _ref4;
        permissions = annotation.permissions || {};
        action_field = permissions[action] || [];
        if (_ref = this.groups.world, __indexOf.call(action_field, _ref) >= 0) {
          return true;
        } else if ((user != null) && (user.userId != null) && (user.consumerKey != null)) {
          if (user.userId === annotation.user && user.consumerKey === annotation.consumer) {
            return true;
          } else if (_ref2 = this.groups.authenticated, __indexOf.call(action_field, _ref2) >= 0) {
            return true;
          } else if (user.consumerKey === annotation.consumer && (_ref3 = this.groups.consumer, __indexOf.call(action_field, _ref3) >= 0)) {
            return true;
          } else if (user.consumerKey === annotation.consumer && (_ref4 = user.userId, __indexOf.call(action_field, _ref4) >= 0)) {
            return true;
          } else if (user.consumerKey === annotation.consumer && user.admin) {
            return true;
          } else {
            return false;
          }
        }
      },
      permissions: {
        'read': ['group:__world__'],
        'update': [],
        'delete': [],
        'admin': []
      }
    };

    AnnotateItPermissions.prototype.addFieldsToAnnotation = function(annotation) {
      AnnotateItPermissions.__super__.addFieldsToAnnotation.apply(this, arguments);
      if (annotation && this.user) {
        return annotation.consumer = this.user.consumerKey;
      }
    };

    AnnotateItPermissions.prototype.updatePermissionsField = function(action, field, annotation) {
      var input;
      field = $(field).show();
      input = field.find('input').removeAttr('disabled');
      if (!this.authorize('admin', annotation)) field.hide();
      if (this.user && this.authorize(action, annotation || {}, {
        userId: '__nonexistentuser__',
        consumerKey: this.user.consumerKey
      })) {
        return input.attr('checked', 'checked');
      } else {
        return input.removeAttr('checked');
      }
    };

    AnnotateItPermissions.prototype.updateAnnotationPermissions = function(type, field, annotation) {
      var dataKey;
      if (!annotation.permissions) {
        annotation.permissions = this.options.permissions;
      }
      dataKey = type + '-permissions';
      if ($(field).find('input').is(':checked')) {
        return annotation.permissions[type] = [type === 'read' ? this.options.groups.world : this.options.groups.consumer];
      } else {
        return annotation.permissions[type] = [];
      }
    };

    AnnotateItPermissions.prototype._setAuthFromToken = function(token) {
      return this.setUser(token);
    };

    return AnnotateItPermissions;

  })(Annotator.Plugin.Permissions);

}).call(this);
