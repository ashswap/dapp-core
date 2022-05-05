import { WalletProvider, ExtensionProvider, HWProvider, WalletConnectProvider, Address, TransactionVersion, TransactionOptions, ChainID, TransactionPayload, Transaction, Balance, Nonce, GasLimit, GasPrice, ProxyProvider, SignableMessage, Token, NetworkConfig, GasPriceModifier, ApiProvider } from '@elrondnetwork/erdjs';
import { createAction, createSlice, combineReducers, configureStore } from '@reduxjs/toolkit';
import { REHYDRATE, persistReducer, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, persistStore, createMigrate } from 'redux-persist';
import moment$2 from 'moment';
import omit from 'lodash.omit';
import BigNumber from 'bignumber.js';
import throttle from 'lodash.throttle';
import isEqual from 'lodash.isequal';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { Address as Address$1, createBalanceBuilder, Token as Token$1, TokenType } from '@elrondnetwork/erdjs/out';
import React__default, { useState, useEffect, useRef, useContext, useCallback, createElement, Fragment, useMemo } from 'react';
import { createDispatchHook, createSelectorHook, Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import axios from 'axios';
import { Signature } from '@elrondnetwork/erdjs/out/signature';
import qs from 'qs';
import { useIdleTimer as useIdleTimer$1 } from 'react-idle-timer';
import classNames from 'classnames';
import debounce$1 from 'lodash.debounce';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
});

var ERROR_SIGNING = 'error when signing';
var TRANSACTION_CANCELLED = 'Transaction cancelled';
var ERROR_SIGNING_TX = 'error signing transaction';
var PROVIDER_NOT_INTIALIZED = 'provider not intialized';
var MISSING_PROVIDER_MESSAGE = 'You need a signer/valid signer to send a transaction,use either WalletProvider, LedgerProvider or WalletConnect';

var errorsMessages = {
  __proto__: null,
  ERROR_SIGNING: ERROR_SIGNING,
  TRANSACTION_CANCELLED: TRANSACTION_CANCELLED,
  ERROR_SIGNING_TX: ERROR_SIGNING_TX,
  PROVIDER_NOT_INTIALIZED: PROVIDER_NOT_INTIALIZED,
  MISSING_PROVIDER_MESSAGE: MISSING_PROVIDER_MESSAGE
};

var DEFAULT_MIN_GAS_LIMIT = 50000;
var configEndpoint = 'dapp/config';
var fallbackNetworkConfigurations = {
  devnet: {
    id: 'devnet',
    chainId: 'D',
    name: 'Devnet',
    egldLabel: 'xEGLD',
    egldDenomination: '18',
    decimals: '4',
    gasPerDataByte: '1500',
    walletConnectDeepLink: 'https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://maiar.com/',
    walletConnectBridgeAddresses: ['https://bridge.walletconnect.org'],
    walletAddress: 'https://devnet-wallet.elrond.com',
    apiAddress: 'https://devnet-api.elrond.com',
    explorerAddress: 'http://devnet-explorer.elrond.com',
    apiTimeout: '4000'
  },
  testnet: {
    id: 'testnet',
    chainId: 'T',
    name: 'Testnet',
    egldLabel: 'xEGLD',
    egldDenomination: '18',
    decimals: '4',
    gasPerDataByte: '1500',
    walletConnectDeepLink: 'https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://maiar.com/',
    walletConnectBridgeAddresses: ['https://bridge.walletconnect.org'],
    walletAddress: 'https://testnet-wallet.elrond.com',
    apiAddress: 'https://testnet-api.elrond.com',
    explorerAddress: 'http://testnet-explorer.elrond.com',
    apiTimeout: '4000'
  },
  mainnet: {
    id: 'mainnet',
    chainId: '1',
    name: 'Mainnet',
    egldLabel: 'xEGLD',
    egldDenomination: '18',
    decimals: '4',
    gasPerDataByte: '1500',
    walletConnectDeepLink: 'https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://maiar.com/',
    walletConnectBridgeAddresses: ['https://bridge.walletconnect.org'],
    walletAddress: 'https://wallet.elrond.com',
    apiAddress: 'https://api.elrond.com',
    explorerAddress: 'https://explorer.elrond.com',
    apiTimeout: '4000'
  }
};

var network = {
  __proto__: null,
  DEFAULT_MIN_GAS_LIMIT: DEFAULT_MIN_GAS_LIMIT,
  configEndpoint: configEndpoint,
  fallbackNetworkConfigurations: fallbackNetworkConfigurations
};

var ledgerErrorCodes = {
  0x9000: {
    code: 'codeSuccess',
    message: 'Success'
  },
  0x6985: {
    code: 'ERR_USER_DENIED',
    message: 'Rejected by user'
  },
  0x6d00: {
    code: 'ERR_UNKNOWN_INSTRUCTION',
    message: 'Unknown instruction'
  },
  0x6e00: {
    code: 'ERR_WRONG_CLA',
    message: 'Wrong CLA'
  },
  0x6e01: {
    code: 'ERR_INVALID_ARGUMENTS',
    message: 'Invalid arguments'
  },
  0x6e02: {
    code: 'ERR_INVALID_MESSAGE',
    message: 'Invalid message'
  },
  0x6e03: {
    code: 'ERR_INVALID_P1',
    message: 'Invalid P1'
  },
  0x6e04: {
    code: 'ERR_MESSAGE_TOO_LONG',
    message: 'Message too long'
  },
  0x6e05: {
    code: 'ERR_RECEIVER_TOO_LONG',
    message: 'Receiver too long'
  },
  0x6e06: {
    code: 'ERR_AMOUNT_TOO_LONG',
    message: 'Amount too long'
  },
  0x6e07: {
    code: 'ERR_CONTRACT_DATA_DISABLED',
    message: 'Contract data disabled in app options'
  },
  0x6e08: {
    code: 'ERR_MESSAGE_INCOMPLETE',
    message: 'Message incomplete'
  },
  0x6e10: {
    code: 'ERR_SIGNATURE_FAILED',
    message: 'Signature failed'
  },
  0x6e09: {
    code: 'ERR_WRONG_TX_VERSION',
    message: 'Wrong TX version'
  },
  0x6e0a: {
    code: 'ERR_NONCE_TOO_LONG',
    message: 'Nonce too long'
  },
  0x6e0b: {
    code: 'ERR_INVALID_AMOUNT',
    message: 'Invalid amount'
  },
  0x6e0c: {
    code: 'ERR_INVALID_FEE',
    message: 'Invalid fee'
  },
  0x6e0d: {
    code: 'ERR_PRETTY_FAILED',
    message: 'Pretty failed'
  },
  0x6e0e: {
    code: 'ERR_DATA_TOO_LONG',
    message: 'Data too long'
  },
  0x6e0f: {
    code: 'ERR_WRONG_TX_OPTIONS',
    message: 'Invalid transaction options'
  },
  0x6e11: {
    code: 'ERR_SIGN_TX_DEPRECATED',
    message: 'Regular transaction signing is deprecated in this version. Use hash signing.'
  }
};

var ledgerErrorCodes$1 = {
  __proto__: null,
  'default': ledgerErrorCodes
};

var gasPriceModifier = '0.01';
var gasPerDataByte = '1500';
var gasLimit = '50000';
var gasPrice = 1000000000;
var denomination = 18;
var decimals = 4;
var version = 1;
var ledgerContractDataEnabledValue = 1;
var dappInitRoute = '/dapp/init';
var walletSignSession = 'signSession';

var index = {
  __proto__: null,
  errorsMessages: errorsMessages,
  networkConstants: network,
  ledgerErrorCodes: ledgerErrorCodes$1,
  gasPriceModifier: gasPriceModifier,
  gasPerDataByte: gasPerDataByte,
  gasLimit: gasLimit,
  gasPrice: gasPrice,
  denomination: denomination,
  decimals: decimals,
  version: version,
  ledgerContractDataEnabledValue: ledgerContractDataEnabledValue,
  dappInitRoute: dappInitRoute,
  walletSignSession: walletSignSession
};

var TransactionServerStatusesEnum;

(function (TransactionServerStatusesEnum) {
  TransactionServerStatusesEnum["pending"] = "pending";
  TransactionServerStatusesEnum["fail"] = "fail";
  TransactionServerStatusesEnum["invalid"] = "invalid";
  TransactionServerStatusesEnum["success"] = "success";
  TransactionServerStatusesEnum["executed"] = "executed";
  TransactionServerStatusesEnum["completed"] = "completed";
})(TransactionServerStatusesEnum || (TransactionServerStatusesEnum = {}));

var TransactionBatchStatusesEnum;

(function (TransactionBatchStatusesEnum) {
  TransactionBatchStatusesEnum["signed"] = "signed";
  TransactionBatchStatusesEnum["cancelled"] = "cancelled";
  TransactionBatchStatusesEnum["success"] = "success";
  TransactionBatchStatusesEnum["sent"] = "sent";
  TransactionBatchStatusesEnum["fail"] = "fail";
  TransactionBatchStatusesEnum["timedOut"] = "timedOut";
})(TransactionBatchStatusesEnum || (TransactionBatchStatusesEnum = {}));

var LoginMethodsEnum;

(function (LoginMethodsEnum) {
  LoginMethodsEnum["ledger"] = "ledger";
  LoginMethodsEnum["walletconnect"] = "walletconnect";
  LoginMethodsEnum["wallet"] = "wallet";
  LoginMethodsEnum["extension"] = "extension";
  LoginMethodsEnum["extra"] = "extra";
  LoginMethodsEnum["none"] = "";
})(LoginMethodsEnum || (LoginMethodsEnum = {}));

var NotificationTypesEnum;

(function (NotificationTypesEnum) {
  NotificationTypesEnum["warning"] = "warning";
  NotificationTypesEnum["error"] = "error";
  NotificationTypesEnum["success"] = "success";
})(NotificationTypesEnum || (NotificationTypesEnum = {}));

var TypesOfSmartContractCallsEnum;

(function (TypesOfSmartContractCallsEnum) {
  TypesOfSmartContractCallsEnum["MultiESDTNFTTransfer"] = "MultiESDTNFTTransfer";
  TypesOfSmartContractCallsEnum["ESDTNFTTransfer"] = "ESDTNFTTransfer";
})(TypesOfSmartContractCallsEnum || (TypesOfSmartContractCallsEnum = {}));

var EnvironmentsEnum;

(function (EnvironmentsEnum) {
  EnvironmentsEnum["testnet"] = "testnet";
  EnvironmentsEnum["devnet"] = "devnet";
  EnvironmentsEnum["mainnet"] = "mainnet";
})(EnvironmentsEnum || (EnvironmentsEnum = {}));

var DAPP_INIT_ROUTE = '/dapp/init';
var getProviderType = function getProviderType(provider) {
  switch (provider == null ? void 0 : provider.constructor) {
    case WalletProvider:
      return LoginMethodsEnum.wallet;

    case WalletConnectProvider:
      return LoginMethodsEnum.walletconnect;

    case HWProvider:
      return LoginMethodsEnum.ledger;

    case ExtensionProvider:
      return LoginMethodsEnum.extension;

    case EmptyProvider:
      return LoginMethodsEnum.none;

    default:
      return LoginMethodsEnum.extra;
  }
};
var newWalletProvider = function newWalletProvider(walletAddress) {
  return new WalletProvider("" + walletAddress + DAPP_INIT_ROUTE);
};
var getLedgerConfiguration = /*#__PURE__*/function () {
  var _ref = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(initializedHwWalletP) {
    var hwApp, _yield$hwApp$getAppCo, contractData, version, dataEnabled;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (initializedHwWalletP.isInitialized()) {
              _context.next = 2;
              break;
            }

            throw new Error('Unable to get version. Provider not initialized');

          case 2:
            hwApp = initializedHwWalletP.hwApp;
            _context.next = 5;
            return hwApp.getAppConfiguration();

          case 5:
            _yield$hwApp$getAppCo = _context.sent;
            contractData = _yield$hwApp$getAppCo.contractData;
            version = _yield$hwApp$getAppCo.version;
            dataEnabled = contractData === ledgerContractDataEnabledValue;
            return _context.abrupt("return", {
              version: version,
              dataEnabled: dataEnabled
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getLedgerConfiguration(_x) {
    return _ref.apply(this, arguments);
  };
}();

var notInitializedError = function notInitializedError(caller) {
  return "Unable to perform " + caller + ", Provider not initialized";
};

var EmptyProvider = /*#__PURE__*/function () {
  function EmptyProvider() {}

  var _proto = EmptyProvider.prototype;

  _proto.init = /*#__PURE__*/function () {
    var _init = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2() {
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", false);

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function init() {
      return _init.apply(this, arguments);
    }

    return init;
  }();

  _proto.login = function login(options) {
    throw new Error(notInitializedError("login with options: " + options));
  };

  _proto.logout = /*#__PURE__*/function () {
    var _logout = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(options) {
      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              throw new Error(notInitializedError("logout with options: " + options));

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function logout(_x2) {
      return _logout.apply(this, arguments);
    }

    return logout;
  }();

  _proto.getAddress = /*#__PURE__*/function () {
    var _getAddress = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4() {
      return runtime_1.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              throw new Error(notInitializedError('getAddress'));

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function getAddress() {
      return _getAddress.apply(this, arguments);
    }

    return getAddress;
  }();

  _proto.isInitialized = function isInitialized() {
    return false;
  };

  _proto.isConnected = /*#__PURE__*/function () {
    var _isConnected = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5() {
      return runtime_1.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", false);

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    function isConnected() {
      return _isConnected.apply(this, arguments);
    }

    return isConnected;
  }();

  _proto.sendTransaction = /*#__PURE__*/function () {
    var _sendTransaction = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee6(transaction, options) {
      return runtime_1.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              throw new Error(notInitializedError("sendTransaction with transactions: " + transaction + " options: " + options));

            case 1:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    function sendTransaction(_x3, _x4) {
      return _sendTransaction.apply(this, arguments);
    }

    return sendTransaction;
  }();

  _proto.signTransaction = /*#__PURE__*/function () {
    var _signTransaction = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee7(transaction, options) {
      return runtime_1.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              throw new Error(notInitializedError("signTransaction with transactions: " + transaction + " options: " + options));

            case 1:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    function signTransaction(_x5, _x6) {
      return _signTransaction.apply(this, arguments);
    }

    return signTransaction;
  }();

  _proto.signTransactions = /*#__PURE__*/function () {
    var _signTransactions = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee8(transactions, options) {
      return runtime_1.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              throw new Error(notInitializedError("signTransactions with transactions: " + transactions + " options: " + options));

            case 1:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    function signTransactions(_x7, _x8) {
      return _signTransactions.apply(this, arguments);
    }

    return signTransactions;
  }();

  _proto.signMessage = /*#__PURE__*/function () {
    var _signMessage = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee9(message) {
      return runtime_1.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              throw new Error(notInitializedError("signTransactions with " + message));

            case 1:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    function signMessage(_x9) {
      return _signMessage.apply(this, arguments);
    }

    return signMessage;
  }();

  return EmptyProvider;
}();
var emptyProvider = /*#__PURE__*/new EmptyProvider();

var accountProvider = emptyProvider;
var externalProvider = null;
function setAccountProvider(provider) {
  accountProvider = provider;
}
function setExternalProvider(provider) {
  externalProvider = provider;
}
function setExternalProviderAsAccountProvider() {
  if (externalProvider != null) {
    accountProvider = externalProvider;
  }
}
function getAccountProvider() {
  return accountProvider || emptyProvider;
}
function getExternalProvider() {
  return externalProvider;
}

var logoutAction = /*#__PURE__*/createAction('logout');
var loginAction = /*#__PURE__*/createAction('login', function (payload) {
  return {
    payload: payload
  };
});

var localStorageKeys = {
  loginExpiresAt: 'dapp-core-login-expires-at'
};
var hasLocalStorage = typeof localStorage !== 'undefined';
var setItem = function setItem(_ref) {
  var key = _ref.key,
      data = _ref.data,
      expires = _ref.expires;

  if (!hasLocalStorage) {
    return;
  }

  localStorage.setItem(String(key), JSON.stringify({
    expires: expires,
    data: data
  }));
};
var getItem = function getItem(key) {
  if (!hasLocalStorage) {
    return;
  }

  var item = localStorage.getItem(String(key));

  if (!item) {
    return null;
  }

  var deserializedItem = JSON.parse(item);

  if (!deserializedItem) {
    return null;
  }

  if (!deserializedItem.hasOwnProperty('expires') || !deserializedItem.hasOwnProperty('data')) {
    return null;
  }

  var expired = moment$2().unix() >= deserializedItem.expires;

  if (expired) {
    localStorage.removeItem(String(key));
    return null;
  }

  return deserializedItem.data;
};
var removeItem = function removeItem(key) {
  if (!hasLocalStorage) {
    return;
  }

  localStorage.removeItem(String(key));
};

var local = {
  __proto__: null,
  localStorageKeys: localStorageKeys,
  setItem: setItem,
  getItem: getItem,
  removeItem: removeItem
};

var moment = {};

try {
  moment = /*#__PURE__*/require('moment');
} catch (err) {}

var moment$1 = moment;

var setItem$1 = function setItem(_ref) {
  var key = _ref.key,
      data = _ref.data,
      expires = _ref.expires;
  sessionStorage.setItem(String(key), JSON.stringify({
    expires: expires,
    data: data
  }));
};
var getItem$1 = function getItem(key) {
  var item = sessionStorage.getItem(String(key));

  if (!item) {
    return null;
  }

  var deserializedItem = JSON.parse(item);

  if (!deserializedItem) {
    return null;
  }

  if (!deserializedItem.hasOwnProperty('expires') || !deserializedItem.hasOwnProperty('data')) {
    return null;
  }

  var expired = moment$1().unix() >= deserializedItem.expires;

  if (expired) {
    sessionStorage.removeItem(String(key));
    return null;
  }

  return deserializedItem.data;
};
var removeItem$1 = function removeItem(key) {
  return sessionStorage.removeItem(String(key));
};
var clear = function clear() {
  return sessionStorage.clear();
};
var storage = {
  setItem: setItem$1,
  getItem: getItem$1,
  removeItem: removeItem$1,
  clear: clear
};

var session = {
  __proto__: null,
  setItem: setItem$1,
  getItem: getItem$1,
  removeItem: removeItem$1,
  clear: clear,
  storage: storage,
  'default': storage
};

var storage$1 = {
  session: session,
  local: local
};

function getNewLoginExpiresTimestamp() {
  return new Date().setHours(new Date().getHours() + 24);
}
function setLoginExpiresAt(expiresAt) {
  storage$1.local.setItem({
    key: localStorageKeys.loginExpiresAt,
    data: expiresAt,
    expires: expiresAt
  });
}

var initialState = {
  loginMethod: LoginMethodsEnum.none,
  walletConnectLogin: null,
  ledgerLogin: null,
  tokenLogin: null,
  walletLogin: null,
  extensionLogin: null
};
var loginInfoSlice = /*#__PURE__*/createSlice({
  name: 'loginInfoSlice',
  initialState: initialState,
  reducers: {
    setLoginMethod: function setLoginMethod(state, action) {
      state.loginMethod = action.payload;
    },
    setTokenLogin: function setTokenLogin(state, action) {
      state.tokenLogin = action.payload;
    },
    setTokenLoginSignature: function setTokenLoginSignature(state, action) {
      if ((state == null ? void 0 : state.tokenLogin) != null) {
        state.tokenLogin.signature = action.payload;
      }
    },
    setWalletLogin: function setWalletLogin(state, action) {
      state.walletLogin = action.payload;
    },
    setWalletConnectLogin: function setWalletConnectLogin(state, action) {
      state.walletConnectLogin = action.payload;
    },
    setLedgerLogin: function setLedgerLogin(state, action) {
      state.ledgerLogin = action.payload;
    }
  },
  extraReducers: function extraReducers(builder) {
    builder.addCase(logoutAction, function () {
      return initialState;
    });
    builder.addCase(loginAction, function (state, action) {
      state.loginMethod = action.payload.loginMethod;
      setLoginExpiresAt(getNewLoginExpiresTimestamp());
    });
  }
});
var _loginInfoSlice$actio = loginInfoSlice.actions,
    setWalletConnectLogin = _loginInfoSlice$actio.setWalletConnectLogin,
    setLedgerLogin = _loginInfoSlice$actio.setLedgerLogin,
    setTokenLogin = _loginInfoSlice$actio.setTokenLogin,
    setTokenLoginSignature = _loginInfoSlice$actio.setTokenLoginSignature,
    setWalletLogin = _loginInfoSlice$actio.setWalletLogin;
var loginInfo = loginInfoSlice.reducer;

function optionalRedirect(callbackUrl, shouldRedirect) {
  if (shouldRedirect && callbackUrl != null) {
    setTimeout(function () {
      if (!window.location.pathname.includes(callbackUrl)) {
        window.location.href = callbackUrl;
      }
    }, 200);
  }
}

function getBridgeAddressFromNetwork(walletConnectBridgeAddresses) {
  return walletConnectBridgeAddresses[Math.floor(Math.random() * walletConnectBridgeAddresses.length)];
}

var defaultNetwork = {
  id: 'not-configured',
  chainId: '',
  name: 'NOT CONFIGURED',
  egldLabel: '',
  egldDenomination: '18',
  decimals: '4',
  gasPerDataByte: '1500',
  walletConnectDeepLink: '',
  walletConnectBridgeAddress: '',
  walletAddress: '',
  apiAddress: '',
  explorerAddress: '',
  apiTimeout: '4000'
};
var initialState$1 = {
  network: defaultNetwork,
  chainID: '-1'
};
var networkConfigSlice = /*#__PURE__*/createSlice({
  name: 'appConfig',
  initialState: initialState$1,
  reducers: {
    initializeNetworkConfig: function initializeNetworkConfig(state, action) {
      var walletConnectBridgeAddress = getBridgeAddressFromNetwork(action.payload.walletConnectBridgeAddresses);
      var network = omit(action.payload, 'walletConnectBridgeAddresses');
      state.network = _extends({}, state.network, network, {
        walletConnectBridgeAddress: walletConnectBridgeAddress
      });
    },
    setChainID: function setChainID(state, action) {
      state.chainID = action.payload;
    }
  }
});
var _networkConfigSlice$a = networkConfigSlice.actions,
    initializeNetworkConfig = _networkConfigSlice$a.initializeNetworkConfig,
    setChainID = _networkConfigSlice$a.setChainID;
var networkConfig = networkConfigSlice.reducer;

var emptyAccount = {
  balance: '...',
  address: '',
  nonce: 0
};
var initialState$2 = {
  address: '',
  account: emptyAccount,
  ledgerAccount: null,
  publicKey: '',
  walletConnectAccount: null,
  isAccountLoading: true,
  accountLoadingError: null
};
var accountInfoSlice = /*#__PURE__*/createSlice({
  name: 'accountInfoSlice',
  initialState: initialState$2,
  reducers: {
    setAddress: function setAddress(state, action) {
      var address = action.payload;
      state.address = address;
      state.publicKey = new Address(address).hex();
    },
    setAccount: function setAccount(state, action) {
      state.account = action.payload;
      state.isAccountLoading = false;
      state.accountLoadingError = null;
    },
    setAccountNonce: function setAccountNonce(state, action) {
      state.account.nonce = action.payload;
    },
    setAccountShard: function setAccountShard(state, action) {
      state.shard = action.payload;
    },
    setLedgerAccount: function setLedgerAccount(state, action) {
      state.ledgerAccount = action.payload;
    },
    updateLedgerAccount: function updateLedgerAccount(state, action) {
      if (state.ledgerAccount != null) {
        state.ledgerAccount.index = action.payload.index;
        state.ledgerAccount.address = action.payload.address;
      }
    },
    setWalletConnectAccount: function setWalletConnectAccount(state, action) {
      state.walletConnectAccount = action.payload;
    },
    setIsAccountLoading: function setIsAccountLoading(state, action) {
      state.isAccountLoading = action.payload;
      state.accountLoadingError = null;
    },
    setAccountLoadingError: function setAccountLoadingError(state, action) {
      state.accountLoadingError = action.payload;
      state.isAccountLoading = false;
    }
  },
  extraReducers: function extraReducers(builder) {
    builder.addCase(logoutAction, function () {
      storage$1.local.removeItem(localStorageKeys.loginExpiresAt);
      return initialState$2;
    });
    builder.addCase(loginAction, function (state, action) {
      var address = action.payload.address;
      state.address = address;
      state.publicKey = new Address(address).hex();
    });
    builder.addCase(REHYDRATE, function (state, action) {
      var _action$payload;

      if (!((_action$payload = action.payload) != null && _action$payload.account)) {
        return;
      }

      var accountInfo = action.payload.account;
      var address = accountInfo.address,
          shard = accountInfo.shard,
          account = accountInfo.account,
          publicKey = accountInfo.publicKey;
      state.address = address;
      state.shard = shard;
      state.account = account;
      state.publicKey = publicKey;
    });
  }
});
var _accountInfoSlice$act = accountInfoSlice.actions,
    setAccount = _accountInfoSlice$act.setAccount,
    setAccountNonce = _accountInfoSlice$act.setAccountNonce,
    setAccountShard = _accountInfoSlice$act.setAccountShard,
    setLedgerAccount = _accountInfoSlice$act.setLedgerAccount,
    updateLedgerAccount = _accountInfoSlice$act.updateLedgerAccount,
    setIsAccountLoading = _accountInfoSlice$act.setIsAccountLoading,
    setAccountLoadingError = _accountInfoSlice$act.setAccountLoadingError;
var account = accountInfoSlice.reducer;

var pendingBatchTransactionsStates = [TransactionBatchStatusesEnum.sent];
var successBatchTransactionsStates = [TransactionBatchStatusesEnum.success];
var failBatchTransactionsStates = [TransactionBatchStatusesEnum.fail, TransactionBatchStatusesEnum.cancelled, TransactionBatchStatusesEnum.timedOut];
var timedOutBatchTransactionsStates = [TransactionBatchStatusesEnum.timedOut];
var pendingServerTransactionsStatuses = [TransactionServerStatusesEnum.pending];
var successServerTransactionsStates = [TransactionServerStatusesEnum.success];
var completedServerTransactionsStates = [TransactionServerStatusesEnum.completed];
var failServerTransactionsStates = [TransactionServerStatusesEnum.fail, TransactionServerStatusesEnum.invalid];
function getIsTransactionCompleted(status) {
  return completedServerTransactionsStates.includes(status);
}
function getIsTransactionPending(status) {
  return status != null && (isBatchTransactionPending(status) || isServerTransactionPending(status));
}
function getIsTransactionSuccessful(status) {
  return status != null && (isBatchTransactionSuccessful(status) || isServerTransactionSuccessful(status));
}
function getIsTransactionFailed(status) {
  return status != null && (isBatchTransactionFailed(status) || isServerTransactionFailed(status));
}
function getIsTransactionTimedOut(status) {
  return status != null && isBatchTransactionTimedOut(status);
}
function isBatchTransactionPending(status) {
  return status != null && pendingBatchTransactionsStates.includes(status);
}
function isBatchTransactionSuccessful(status) {
  return status != null && successBatchTransactionsStates.includes(status);
}
function isBatchTransactionFailed(status) {
  return status != null && failBatchTransactionsStates.includes(status);
}
function isBatchTransactionTimedOut(status) {
  return status != null && timedOutBatchTransactionsStates.includes(status);
}
function isServerTransactionPending(status) {
  return status != null && pendingServerTransactionsStatuses.includes(status);
}
function isServerTransactionSuccessful(status) {
  return status != null && successServerTransactionsStates.includes(status);
}
function isServerTransactionFailed(status) {
  return status != null && failServerTransactionsStates.includes(status);
}

var TransactionTypesEnum;

(function (TransactionTypesEnum) {
  TransactionTypesEnum["MultiESDTNFTTransfer"] = "MultiESDTNFTTransfer";
  TransactionTypesEnum["ESDTTransfer"] = "ESDTTransfer";
  TransactionTypesEnum["ESDTNFTTransfer"] = "ESDTNFTTransfer";
  TransactionTypesEnum["esdtTransaction"] = "esdtTransaction";
  TransactionTypesEnum["nftTransaction"] = "nftTransaction";
  TransactionTypesEnum["scCall"] = "scCall";
})(TransactionTypesEnum || (TransactionTypesEnum = {}));

var isUtf8 = function isUtf8(str) {
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127) return false;
  }

  return true;
};

function decodePart(part) {
  var decodedPart = part;

  try {
    var hexPart = Buffer.from(part, 'hex').toString().trim();

    if (isUtf8(hexPart) && hexPart.length > 1) {
      decodedPart = hexPart;
    }
  } catch (error) {}

  return decodedPart;
}

function isStringBase64(string) {
  try {
    return Buffer.from(string, 'base64').toString() === atob(string);
  } catch (err) {
    return false;
  }
}
function encodeToBase64(string) {
  return btoa(string);
}
function decodeBase64(string) {
  return atob(string);
}

var getAllStringOccurrences = function getAllStringOccurrences(sourceStr, searchStr) {
  var startingIndices = [];
  var indexOccurence = sourceStr.indexOf(searchStr, 0);

  while (indexOccurence >= 0) {
    startingIndices.push(indexOccurence);
    indexOccurence = sourceStr.indexOf(searchStr, indexOccurence + 1);
  }

  return startingIndices;
};

function parseMultiEsdtTransferData(data) {
  var transactions = [];
  var contractCallDataIndex = 0;

  try {
    if (data != null && data.startsWith(TransactionTypesEnum.MultiESDTNFTTransfer) && data != null && data.includes('@')) {
      var _data$split = data == null ? void 0 : data.split('@'),
          receiver = _data$split[1],
          encodedTxCount = _data$split[2],
          rest = _data$split.slice(3);

      if (receiver) {
        var txCount = new BigNumber(encodedTxCount, 16).toNumber();
        var itemIndex = 0;

        for (var txIndex = 0; txIndex < txCount; txIndex++) {
          var transaction = {
            type: TransactionTypesEnum.nftTransaction,
            data: '',
            receiver: receiver
          };

          for (var index = 0; index < 3; index++) {
            switch (index) {
              case 0:
                transaction.token = decodePart(rest[itemIndex]);
                transaction.data = rest[itemIndex];
                break;

              case 1:
                {
                  var encodedNonce = rest[itemIndex] && rest[itemIndex].length ? rest[itemIndex] : '';

                  if (encodedNonce) {
                    transaction.nonce = encodedNonce;
                  } else {
                    transaction.type = TransactionTypesEnum.esdtTransaction;
                  }

                  transaction.data = transaction.data + "@" + rest[itemIndex];
                  break;
                }

              case 2:
                transaction.amount = new BigNumber(rest[itemIndex], 16).toString(10);
                transaction.data = transaction.data + "@" + rest[itemIndex];
                break;

              default:
                break;
            }

            contractCallDataIndex = itemIndex + 1;
            itemIndex++;
          }

          transactions[txIndex] = transaction;
        }

        var isDifferentFromTxCount = transactions.length !== txCount;
        var hasInvalidNoOfAdSigns = transactions.some(function (tx) {
          var adSignOccurences = getAllStringOccurrences(tx.data, '@').length;
          return adSignOccurences !== 2;
        });
        var hasAdStart = transactions.some(function (tx) {
          return tx.data.startsWith('@');
        });

        if (isDifferentFromTxCount || hasInvalidNoOfAdSigns || hasAdStart) {
          return [];
        }

        if (rest[contractCallDataIndex]) {
          var scCallData = rest[contractCallDataIndex];

          for (var i = contractCallDataIndex + 1; i < rest.length; i++) {
            scCallData += '@' + rest[i];
          }

          transactions[txCount] = {
            type: TransactionTypesEnum.scCall,
            data: scCallData,
            receiver: receiver
          };
        }
      }
    }
  } catch (err) {
    console.error('failed parsing tx', err);
    return transactions;
  }

  return transactions;
}

function canTransformToPublicKey(address) {
  try {
    var checkAddress = new Address(address);
    return Boolean(checkAddress.bech32());
  } catch (_unused) {
    return false;
  }
}

function addressIsValid(destinationAddress) {
  var isValidBach = (destinationAddress == null ? void 0 : destinationAddress.startsWith('erd')) && destinationAddress.length === 62 && /^\w+$/.test(destinationAddress);
  return isValidBach && canTransformToPublicKey(destinationAddress);
}

var noData = {
  tokenId: '',
  amount: ''
};

var decodeData = function decodeData(data) {
  var nonceIndex = 2;
  var amountIndex = 3;
  var parts = data.split('@');
  var decodedParts = parts.map(function (part, i) {
    return [nonceIndex, amountIndex].includes(i) ? part : decodePart(part);
  });
  return decodedParts;
};

function getTokenFromData(data) {
  if (!data) {
    return noData;
  }

  var isTokenTransfer = data.startsWith(TransactionTypesEnum.ESDTTransfer);
  var nftTransfer = data.startsWith(TransactionTypesEnum.ESDTNFTTransfer) && data.includes('@');

  if (isTokenTransfer) {
    var _data$split = data.split('@'),
        encodedToken = _data$split[1],
        encodedAmount = _data$split[2];

    try {
      var tokenId = Buffer.from(encodedToken, 'hex').toString('ascii');

      if (!tokenId) {
        return noData;
      }

      var amount = new BigNumber('0x' + encodedAmount.replace('0x', '')).toString(10);
      return {
        tokenId: tokenId,
        amount: amount
      };
    } catch (e) {}
  }

  if (nftTransfer) {
    try {
      var _decodeData = decodeData(data),

      /*ESDTNFTTransfer*/
      collection = _decodeData[1],
          nonce = _decodeData[2],
          quantity = _decodeData[3],
          receiver = _decodeData[4];

      if ([collection, nonce, quantity, receiver].every(function (el) {
        return Boolean(el);
      }) && addressIsValid(new Address(receiver).bech32())) {
        return {
          tokenId: collection + "-" + nonce,
          amount: new BigNumber(quantity, 16).toString(10),
          collection: collection,
          nonce: nonce,
          receiver: new Address(receiver).bech32()
        };
      }
    } catch (err) {}
  }

  return noData;
}

function isTokenTransfer(_ref) {
  var tokenId = _ref.tokenId,
      erdLabel = _ref.erdLabel;
  return Boolean(tokenId && tokenId !== erdLabel);
}

function buildUrlParams(search, urlParams) {
  var urlSearchParams = new URLSearchParams(search);
  var params = Object.fromEntries(urlSearchParams);
  var nextUrlParams = new URLSearchParams(_extends({}, params, urlParams)).toString();
  return {
    nextUrlParams: nextUrlParams,
    params: params
  };
}

function builtCallbackUrl(_ref) {
  var callbackUrl = _ref.callbackUrl,
      _ref$urlParams = _ref.urlParams,
      urlParams = _ref$urlParams === void 0 ? {} : _ref$urlParams;
  var url = callbackUrl;

  if (Object.entries(urlParams).length > 0) {
    var _URL = new URL(callbackUrl),
        search = _URL.search,
        origin = _URL.origin,
        pathname = _URL.pathname;

    var _buildUrlParams = buildUrlParams(search, urlParams),
        nextUrlParams = _buildUrlParams.nextUrlParams;

    url = "" + origin + pathname + "?" + nextUrlParams;
  }

  return url;
}

function parseTransactionAfterSigning(transaction, isLedger) {
  if (isLedger === void 0) {
    isLedger = false;
  }

  // TODO: REMOVE
  //#region REMOVE when options is available in erdjs getTransactionsFromWalletUrl
  if (isLedger) {
    transaction.version = TransactionVersion.withTxHashSignVersion();
    transaction.options = TransactionOptions.withTxHashSignOptions();
  } //#endregion


  var parsedTransaction = transaction.toPlainObject();
  parsedTransaction.hash = transaction.getHash().toString();
  parsedTransaction.status = TransactionServerStatusesEnum.pending;
  return parsedTransaction;
}

var initialState$3 = {
  signedTransactions: {},
  transactionsToSign: null,
  signTransactionsError: null,
  customTransactionInformationForSessionId: {}
};
var defaultCustomInformation = {
  signWithoutSending: false,
  sessionInformation: null,
  redirectAfterSign: false
};
var transactionsSlice = /*#__PURE__*/createSlice({
  name: 'transactionsSlice',
  initialState: initialState$3,
  reducers: {
    moveTransactionsToSignedState: function moveTransactionsToSignedState(state, action) {
      var _state$customTransact, _state$transactionsTo;

      var _action$payload = action.payload,
          sessionId = _action$payload.sessionId,
          transactions = _action$payload.transactions,
          errorMessage = _action$payload.errorMessage,
          status = _action$payload.status;
      var customTransactionInformation = ((_state$customTransact = state.customTransactionInformationForSessionId) == null ? void 0 : _state$customTransact[sessionId]) || defaultCustomInformation;
      state.signedTransactions[sessionId] = {
        transactions: transactions,
        status: status,
        errorMessage: errorMessage,
        customTransactionInformation: customTransactionInformation
      };

      if ((state == null ? void 0 : (_state$transactionsTo = state.transactionsToSign) == null ? void 0 : _state$transactionsTo.sessionId) === sessionId) {
        state.transactionsToSign = initialState$3.transactionsToSign;
      }
    },
    clearSignedTransaction: function clearSignedTransaction(state, action) {
      if (state.signedTransactions[action.payload]) {
        delete state.signedTransactions[action.payload];
      }
    },
    clearTransactionToSign: function clearTransactionToSign(state) {
      if (state != null && state.transactionsToSign) {
        state.transactionsToSign = null;
      }
    },
    updateSignedTransaction: function updateSignedTransaction(state, action) {
      state.signedTransactions = _extends({}, state.signedTransactions, action.payload);
    },
    updateSignedTransactions: function updateSignedTransactions(state, action) {
      var _action$payload2 = action.payload,
          sessionId = _action$payload2.sessionId,
          status = _action$payload2.status,
          errorMessage = _action$payload2.errorMessage,
          transactions = _action$payload2.transactions;
      var transaction = state.signedTransactions[sessionId];

      if (transaction != null) {
        state.signedTransactions[sessionId].status = status;

        if (errorMessage != null) {
          state.signedTransactions[sessionId].errorMessage = errorMessage;
        }

        if (transactions != null) {
          state.signedTransactions[sessionId].transactions = transactions;
        }
      }
    },
    updateSignedTransactionStatus: function updateSignedTransactionStatus(state, action) {
      var _state$signedTransact, _state$signedTransact2;

      var _action$payload3 = action.payload,
          sessionId = _action$payload3.sessionId,
          status = _action$payload3.status,
          errorMessage = _action$payload3.errorMessage,
          transactionHash = _action$payload3.transactionHash;
      var transactions = (_state$signedTransact = state.signedTransactions) == null ? void 0 : (_state$signedTransact2 = _state$signedTransact[sessionId]) == null ? void 0 : _state$signedTransact2.transactions;

      if (transactions != null) {
        var _state$signedTransact3, _state$signedTransact4, _state$signedTransact5, _state$signedTransact6;

        state.signedTransactions[sessionId].transactions = transactions.map(function (transaction) {
          if (transaction.hash === transactionHash) {
            return _extends({}, transaction, {
              status: status,
              errorMessage: errorMessage
            });
          }

          return transaction;
        });
        var areTransactionsSuccessful = (_state$signedTransact3 = state.signedTransactions[sessionId]) == null ? void 0 : (_state$signedTransact4 = _state$signedTransact3.transactions) == null ? void 0 : _state$signedTransact4.every(function (transaction) {
          return getIsTransactionCompleted(transaction.status);
        });
        var areTransactionsFailed = (_state$signedTransact5 = state.signedTransactions[sessionId]) == null ? void 0 : (_state$signedTransact6 = _state$signedTransact5.transactions) == null ? void 0 : _state$signedTransact6.every(function (transaction) {
          return getIsTransactionFailed(transaction.status);
        });

        if (areTransactionsSuccessful) {
          state.signedTransactions[sessionId].status = TransactionBatchStatusesEnum.success;
        }

        if (areTransactionsFailed) {
          state.signedTransactions[sessionId].status = TransactionBatchStatusesEnum.fail;
        }
      }
    },
    setTransactionsToSign: function setTransactionsToSign(state, action) {
      state.transactionsToSign = action.payload;
      var _action$payload4 = action.payload,
          sessionId = _action$payload4.sessionId,
          customTransactionInformation = _action$payload4.customTransactionInformation;
      state.customTransactionInformationForSessionId[sessionId] = customTransactionInformation;
      state.signTransactionsError = null;
    },
    clearAllTransactionsToSign: function clearAllTransactionsToSign(state) {
      state.transactionsToSign = initialState$3.transactionsToSign;
      state.signTransactionsError = null;
    },
    clearAllSignedTransactions: function clearAllSignedTransactions(state) {
      state.signedTransactions = initialState$3.signedTransactions;
    },
    setSignTransactionsError: function setSignTransactionsError(state, action) {
      state.signTransactionsError = action.payload;
    }
  },
  extraReducers: function extraReducers(builder) {
    builder.addCase(logoutAction, function () {
      return initialState$3;
    });
    builder.addCase(REHYDRATE, function (state, action) {
      var _action$payload5;

      if (!((_action$payload5 = action.payload) != null && _action$payload5.transactions)) {
        return;
      }

      var _action$payload$trans = action.payload.transactions,
          signedTransactions = _action$payload$trans.signedTransactions,
          customTransactionInformationForSessionId = _action$payload$trans.customTransactionInformationForSessionId;
      var parsedSignedTransactions = Object.entries(signedTransactions).reduce(function (acc, _ref) {
        var sessionId = _ref[0],
            transaction = _ref[1];
        var txTimestamp = new Date(sessionId);
        var expiration = new Date();
        expiration.setHours(expiration.getHours() + 5);
        var isExpired = expiration - txTimestamp > 0;

        if (!isExpired) {
          acc[sessionId] = transaction;
        }

        return acc;
      }, {});

      if (customTransactionInformationForSessionId != null) {
        state.customTransactionInformationForSessionId = customTransactionInformationForSessionId;
      }

      if (signedTransactions != null) {
        state.signedTransactions = parsedSignedTransactions;
      }
    });
  }
});
var _transactionsSlice$ac = transactionsSlice.actions,
    updateSignedTransactionStatus = _transactionsSlice$ac.updateSignedTransactionStatus,
    updateSignedTransactions = _transactionsSlice$ac.updateSignedTransactions,
    setTransactionsToSign = _transactionsSlice$ac.setTransactionsToSign,
    clearAllTransactionsToSign = _transactionsSlice$ac.clearAllTransactionsToSign,
    clearAllSignedTransactions = _transactionsSlice$ac.clearAllSignedTransactions,
    clearSignedTransaction = _transactionsSlice$ac.clearSignedTransaction,
    setSignTransactionsError = _transactionsSlice$ac.setSignTransactionsError,
    moveTransactionsToSignedState = _transactionsSlice$ac.moveTransactionsToSignedState;
var transactions = transactionsSlice.reducer;

var defaultTransactionErrorMessage = 'Transaction failed';
var defaultTransactionSuccessMessage = 'Transaction successful';
var defaultTransactionProcessingMessage = 'Processing transaction';
var defaultTransactionSubmittedMessage = 'Transaction submitted';
var initialState$4 = {};
var signTransactionsSlice = /*#__PURE__*/createSlice({
  name: 'transactionsInfo',
  initialState: initialState$4,
  reducers: {
    setTransactionsDisplayInfo: function setTransactionsDisplayInfo(state, action) {
      var _action$payload = action.payload,
          sessionId = _action$payload.sessionId,
          transactionsDisplayInfo = _action$payload.transactionsDisplayInfo;

      if (sessionId != null) {
        state[sessionId] = {
          errorMessage: (transactionsDisplayInfo == null ? void 0 : transactionsDisplayInfo.errorMessage) || defaultTransactionErrorMessage,
          successMessage: (transactionsDisplayInfo == null ? void 0 : transactionsDisplayInfo.successMessage) || defaultTransactionSuccessMessage,
          processingMessage: (transactionsDisplayInfo == null ? void 0 : transactionsDisplayInfo.processingMessage) || defaultTransactionProcessingMessage,
          submittedMessage: (transactionsDisplayInfo == null ? void 0 : transactionsDisplayInfo.submittedMessage) || defaultTransactionSubmittedMessage,
          transactionDuration: transactionsDisplayInfo == null ? void 0 : transactionsDisplayInfo.transactionDuration
        };
      }
    },
    clearTransactionsInfoForSessionId: function clearTransactionsInfoForSessionId(state, action) {
      if (action.payload != null) {
        delete state[action.payload];
      }
    },
    clearTransactionsInfo: function clearTransactionsInfo() {
      return initialState$4;
    }
  },
  extraReducers: function extraReducers(builder) {
    builder.addCase(logoutAction, function () {
      return initialState$4;
    });
  }
});
var _signTransactionsSlic = signTransactionsSlice.actions,
    setTransactionsDisplayInfo = _signTransactionsSlic.setTransactionsDisplayInfo,
    clearTransactionsInfoForSessionId = _signTransactionsSlic.clearTransactionsInfoForSessionId;
var transactionsInfo = signTransactionsSlice.reducer;

var initialState$5 = {};
var modalsSlice = /*#__PURE__*/createSlice({
  name: 'modalsSlice',
  initialState: initialState$5,
  reducers: {
    setTxSubmittedModal: function setTxSubmittedModal(state, action) {
      state.txSubmittedModal = action.payload;
    },
    setNotificationModal: function setNotificationModal(state, action) {
      state.notificationModal = action.payload;
    },
    clearTxSubmittedModal: function clearTxSubmittedModal(state) {
      state.txSubmittedModal = undefined;
    },
    clearNotificationModal: function clearNotificationModal(state) {
      state.notificationModal = undefined;
    }
  },
  extraReducers: function extraReducers(builder) {
    builder.addCase(logoutAction, function () {
      return initialState$5;
    });
  }
});
var _modalsSlice$actions = modalsSlice.actions,
    setTxSubmittedModal = _modalsSlice$actions.setTxSubmittedModal,
    setNotificationModal = _modalsSlice$actions.setNotificationModal,
    clearNotificationModal = _modalsSlice$actions.clearNotificationModal;
var modals = modalsSlice.reducer;

var createDeepEqualSelector = /*#__PURE__*/createSelectorCreator(defaultMemoize, isEqual);

var accountInfoSelector = function accountInfoSelector(state) {
  return state.account;
};
var addressSelector = /*#__PURE__*/createDeepEqualSelector(accountInfoSelector, function (state) {
  return state.address;
});
var accountSelector = /*#__PURE__*/createDeepEqualSelector(accountInfoSelector, function (state) {
  return state.account;
});
var accountBalanceSelector = /*#__PURE__*/createDeepEqualSelector(accountSelector, function (account) {
  return account.balance;
});
var accountNonceSelector = /*#__PURE__*/createDeepEqualSelector(accountSelector, function (state) {
  var _state$nonce;

  return (state == null ? void 0 : (_state$nonce = state.nonce) == null ? void 0 : _state$nonce.valueOf()) || 0;
});
var shardSelector = /*#__PURE__*/createDeepEqualSelector(accountInfoSelector, function (state) {
  return state.shard;
});
var ledgerAccountSelector = /*#__PURE__*/createDeepEqualSelector(accountInfoSelector, function (state) {
  return state.ledgerAccount;
});
var isAccountLoadingSelector = /*#__PURE__*/createDeepEqualSelector(accountInfoSelector, function (state) {
  return state.isAccountLoading;
});

var loginInfoSelector = function loginInfoSelector(state) {
  return state.loginInfo;
};
var loginMethodSelector = /*#__PURE__*/createDeepEqualSelector(loginInfoSelector, function (state) {
  return state.loginMethod;
});
var isLoggedInSelector = /*#__PURE__*/createDeepEqualSelector(loginInfoSelector, addressSelector, function (state, address) {
  return state.loginMethod != LoginMethodsEnum.none && Boolean(address);
});
var walletConnectLoginSelector = /*#__PURE__*/createDeepEqualSelector(loginInfoSelector, function (state) {
  return state.walletConnectLogin;
});
var ledgerLoginSelector = /*#__PURE__*/createDeepEqualSelector(loginInfoSelector, function (state) {
  return state.ledgerLogin;
});
var walletLoginSelector = /*#__PURE__*/createDeepEqualSelector(loginInfoSelector, function (state) {
  return state.walletLogin;
});

var whitelistedActions = ['logout'];
var throttledSetNewExpires = /*#__PURE__*/throttle(function () {
  setLoginExpiresAt(getNewLoginExpiresTimestamp());
}, 5000);
var loginSessionMiddleware = function loginSessionMiddleware(store) {
  return function (next) {
    return function (action) {
      if (whitelistedActions.includes(action.type)) {
        return next(action);
      }

      var appState = store.getState();
      var loginTimestamp = storage$1.local.getItem(localStorageKeys.loginExpiresAt);
      var isLoggedIn = isLoggedInSelector(appState);

      if (!isLoggedIn) {
        return next(action);
      }

      if (loginTimestamp == null) {
        return setLoginExpiresAt(getNewLoginExpiresTimestamp());
      }

      var now = Date.now();
      var isExpired = loginTimestamp - now < 0;

      if (isExpired) {
        return setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
          var provider;
          return runtime_1.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  provider = getAccountProvider();
                  console.log('session expired');
                  store.dispatch(logoutAction());
                  _context.prev = 3;
                  _context.next = 6;
                  return provider == null ? void 0 : provider.logout({
                    callbackUrl: '/'
                  });

                case 6:
                  _context.next = 11;
                  break;

                case 8:
                  _context.prev = 8;
                  _context.t0 = _context["catch"](3);
                  console.error('error logging out', _context.t0);

                case 11:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[3, 8]]);
        })), 1000);
      } else {
        throttledSetNewExpires();
      }

      return next(action);
    };
  };
};

var reducers = {
  account: account,
  networkConfig: networkConfig,
  loginInfo: loginInfo,
  modals: modals,
  transactions: transactions,
  transactionsInfo: transactionsInfo
};

if (typeof window !== 'undefined' && window.localStorage != null) {
  //This allows for this library to be used on other platforms than web, like React Native
  //without this condition, redux-persist 6+ will throw an error if persist storage fails
  var sessionStorage$1 = /*#__PURE__*/require('redux-persist/lib/storage/session')["default"]; //#region custom reducers


  var transactionsInfoPersistConfig = {
    key: 'dapp-core-transactionsInfo',
    version: 1,
    storage: sessionStorage$1
  };
  var transactionsReducer = {
    key: 'dapp-core-transactions',
    version: 1,
    storage: sessionStorage$1,
    blacklist: ['transactionsToSign']
  };
  reducers.transactions = /*#__PURE__*/persistReducer(transactionsReducer, transactions);
  reducers.transactionsInfo = /*#__PURE__*/persistReducer(transactionsInfoPersistConfig, transactionsInfo); //#endregion
}

var rootReducer = /*#__PURE__*/combineReducers(reducers);

var _window;
var localStorageReducers = rootReducer;
var migrations = {
  2: function _(state) {
    return _extends({}, state, {
      networkConfig: defaultNetwork
    });
  }
}; //This allows for this library to be used on other platforms than web, like React Native
//without this condition, redux-persist 6+ will throw an error if persist storage fails

if (typeof window !== 'undefined' && ((_window = window) == null ? void 0 : _window.localStorage) != null) {
  var storage$2 = /*#__PURE__*/require('redux-persist/lib/storage')["default"];

  var persistConfig = {
    key: 'dapp-core-store',
    version: 2,
    storage: storage$2,
    whitelist: ['account', 'loginInfo', 'toasts', 'modals', 'networkConfig'],
    migrate: /*#__PURE__*/createMigrate(migrations, {
      debug: false
    })
  };
  localStorageReducers = /*#__PURE__*/persistReducer(persistConfig, rootReducer);
}

var store = /*#__PURE__*/configureStore({
  reducer: localStorageReducers,
  middleware: function middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'accountInfoSlice/setAccount', 'accountInfoSlice/setAccountNonce'],
        ignoredPaths: ['payload.nonce', 'account.account.nonce']
      }
    }).concat(loginSessionMiddleware);
  }
});
var persistor = /*#__PURE__*/persistStore(store);

var networkConfigSelector = function networkConfigSelector(state) {
  return state.networkConfig;
};
var chainIDSelector = /*#__PURE__*/createDeepEqualSelector(networkConfigSelector, function (state) {
  return new ChainID(state.chainID);
});
var walletConnectBridgeAddressSelector = /*#__PURE__*/createDeepEqualSelector(networkConfigSelector, function (state) {
  return state.network.walletConnectBridgeAddress;
});
var walletConnectDeepLinkSelector = /*#__PURE__*/createDeepEqualSelector(networkConfigSelector, function (state) {
  return state.network.walletConnectDeepLink;
});
var networkSelector = /*#__PURE__*/createDeepEqualSelector(networkConfigSelector, function (state) {
  return state.network;
});
var apiNetworkSelector = /*#__PURE__*/createDeepEqualSelector(networkSelector, function (state) {
  return state.apiAddress;
});
var egldLabelSelector = /*#__PURE__*/createDeepEqualSelector(networkSelector, function (state) {
  return state.egldLabel;
});

function newTransaction(rawTransaction) {
  var _rawTransaction$gasLi, _rawTransaction$gasPr, _rawTransaction$versi;

  var data = rawTransaction.data;
  var dataPayload = isStringBase64(data) ? TransactionPayload.fromEncoded(data) : new TransactionPayload(data);
  return new Transaction(_extends({
    value: Balance.fromString(rawTransaction.value),
    data: dataPayload,
    nonce: new Nonce(rawTransaction.nonce),
    receiver: new Address(rawTransaction.receiver),
    gasLimit: new GasLimit((_rawTransaction$gasLi = rawTransaction.gasLimit) != null ? _rawTransaction$gasLi : gasLimit),
    gasPrice: new GasPrice((_rawTransaction$gasPr = rawTransaction.gasPrice) != null ? _rawTransaction$gasPr : gasPrice),
    chainID: new ChainID(rawTransaction.chainID),
    version: new TransactionVersion((_rawTransaction$versi = rawTransaction.version) != null ? _rawTransaction$versi : version)
  }, rawTransaction.options ? {
    options: new TransactionOptions(rawTransaction.options)
  } : {}));
}

var transactionsSelectors = function transactionsSelectors(state) {
  return state.transactions;
};
var signedTransactionsSelector = /*#__PURE__*/createDeepEqualSelector(transactionsSelectors, function (state) {
  return state.signedTransactions;
});
var signTransactionsErrorSelector = /*#__PURE__*/createDeepEqualSelector(transactionsSelectors, function (state) {
  return state.signTransactionsError;
});

var selectTxByStatus = function selectTxByStatus(txStatusVerifier) {
  return function (signedTransactions) {
    return Object.entries(signedTransactions).reduce(function (acc, _ref) {
      var sessionId = _ref[0],
          txBody = _ref[1];

      if (txStatusVerifier(txBody.status)) {
        acc[sessionId] = txBody;
      }

      return acc;
    }, {});
  };
};

var pendingSignedTransactionsSelector = /*#__PURE__*/createDeepEqualSelector(signedTransactionsSelector, /*#__PURE__*/selectTxByStatus(getIsTransactionPending));
var successfulTransactionsSelector = /*#__PURE__*/createDeepEqualSelector(signedTransactionsSelector, /*#__PURE__*/selectTxByStatus(getIsTransactionSuccessful));
var completedTransactionsSelector = /*#__PURE__*/createDeepEqualSelector(signedTransactionsSelector, /*#__PURE__*/selectTxByStatus(getIsTransactionCompleted));
var failedTransactionsSelector = /*#__PURE__*/createDeepEqualSelector(signedTransactionsSelector, /*#__PURE__*/selectTxByStatus(getIsTransactionFailed));
var timedOutTransactionsSelector = /*#__PURE__*/createDeepEqualSelector(signedTransactionsSelector, /*#__PURE__*/selectTxByStatus(getIsTransactionTimedOut));
var transactionsToSignSelector = /*#__PURE__*/createDeepEqualSelector(transactionsSelectors, function (state) {
  var _state$transactionsTo;

  if ((state == null ? void 0 : state.transactionsToSign) == null) {
    return null;
  }

  return _extends({}, state.transactionsToSign, {
    transactions: (state == null ? void 0 : (_state$transactionsTo = state.transactionsToSign) == null ? void 0 : _state$transactionsTo.transactions.map(function (tx) {
      return newTransaction(tx);
    })) || []
  });
});
var transactionStatusSelector = /*#__PURE__*/createDeepEqualSelector(signedTransactionsSelector, function (_, transactionSessionId) {
  return transactionSessionId;
}, function (signedTransactions, transactionSessionId) {
  return transactionSessionId != null ? (signedTransactions == null ? void 0 : signedTransactions[transactionSessionId]) || {} : {};
});

var defaultTransactionInfo = {
  errorMessage: defaultTransactionErrorMessage,
  successMessage: defaultTransactionSuccessMessage,
  processingMessage: defaultTransactionProcessingMessage
};
var transactionsInfoSelectors = function transactionsInfoSelectors(state) {
  return state.transactionsInfo;
};
var transactionDisplayInfoSelector = /*#__PURE__*/createDeepEqualSelector(transactionsInfoSelectors, function (_, transactionSessionId) {
  return transactionSessionId;
}, function (transactionsDisplayInfo, transactionSessionId) {
  return transactionSessionId != null ? (transactionsDisplayInfo == null ? void 0 : transactionsDisplayInfo[Number(transactionSessionId)]) || defaultTransactionInfo : defaultTransactionInfo;
});

var modalsSliceSelector = function modalsSliceSelector(state) {
  return state.modals;
};
var notificationModalSelector = /*#__PURE__*/createDeepEqualSelector(modalsSliceSelector, function (state) {
  return state.notificationModal;
});

function getIsLoggedIn() {
  return isLoggedInSelector(store.getState());
}

function logout(_x, _x2) {
  return _logout.apply(this, arguments);
}

function _logout() {
  _logout = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(callbackUrl, onRedirect) {
    var provider, providerType, isLoggedIn;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            provider = getAccountProvider();
            providerType = getProviderType(provider);
            isLoggedIn = getIsLoggedIn();

            if (!(!isLoggedIn || !provider)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return");

          case 5:
            store.dispatch(logoutAction());
            _context.prev = 6;
            _context.next = 9;
            return provider.logout({
              callbackUrl: callbackUrl
            });

          case 9:
            if (callbackUrl && providerType !== LoginMethodsEnum.wallet) {
              if (typeof onRedirect === 'function') {
                onRedirect(callbackUrl);
              } else {
                window.location.href = callbackUrl;
              }
            }

            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](6);
            console.error('error logging out', _context.t0);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 12]]);
  }));
  return _logout.apply(this, arguments);
}

function buildUrlParams$1(search, urlParams) {
  var urlSearchParams = new URLSearchParams(search);
  var params = Object.fromEntries(urlSearchParams);
  var nextUrlParams = new URLSearchParams(_extends({}, params, urlParams)).toString();
  return {
    nextUrlParams: nextUrlParams,
    params: params
  };
}

var _excluded = ["default"];
function switchTrue(object) {
  var defaultValue = object["default"],
      rest = _objectWithoutPropertiesLoose(object, _excluded);

  var obj = _extends({
    "default": defaultValue
  }, rest);

  var result = Object.keys(obj).reduce(function (acc, cur) {
    var _extends2;

    return _extends({}, acc, (_extends2 = {}, _extends2[cur === 'default' ? 'true' : cur] = obj[cur], _extends2));
  }, {});
  return result['true'];
}

function getAccountProviderType() {
  var provider = getAccountProvider();
  return getProviderType(provider);
}

function getChainID() {
  return chainIDSelector(store.getState());
}

function getNetworkConfig() {
  return networkSelector(store.getState());
}

function getEgldLabel() {
  return egldLabelSelector(store.getState());
}

function getIsProviderEqualTo(comparedProviderType) {
  var providerType = getAccountProviderType();
  return providerType === comparedProviderType;
}

function getAddress() {
  var search = window.location.search;
  var appState = store.getState();
  var provider = getAccountProvider();
  var address = addressSelector(appState);
  var loggedIn = isLoggedInSelector(appState);
  var walletLogin = walletLoginSelector(appState);

  if (!provider) {
    throw 'provider not initialized';
  }

  if (getIsProviderEqualTo(LoginMethodsEnum.ledger) && loggedIn) {
    return new Promise(function (resolve) {
      resolve(address);
    });
  }

  return !getIsProviderEqualTo(LoginMethodsEnum.none) && !getIsProviderEqualTo(LoginMethodsEnum.wallet) && !getIsProviderEqualTo(LoginMethodsEnum.extra) ? // TODO: does not take into account ledger locked see link for details:
  // https://github.com/ElrondNetwork/dapp/blob/d5c57695a10055f20d387ba064b6843606789ee9/src/helpers/accountMethods.tsx#L21
  provider.getAddress() : new Promise(function (resolve) {
    if (walletLogin != null) {
      var urlSearchParams = new URLSearchParams(search);
      var params = Object.fromEntries(urlSearchParams);

      if (addressIsValid(params.address)) {
        resolve(params.address);
      }
    }

    if (loggedIn) {
      resolve(address);
    }

    resolve('');
  });
}

var proxyProvider = null;
function initializeProxyProvider(networkConfig) {
  var initializationNetworkConfig = networkConfig || networkSelector(store.getState());
  proxyProvider = new ProxyProvider(initializationNetworkConfig.apiAddress, {
    timeout: Number(initializationNetworkConfig.apiTimeout)
  });
  return proxyProvider;
}
function getProxyProvider() {
  if (proxyProvider == null) {
    return initializeProxyProvider();
  } else {
    return proxyProvider;
  }
}
function getAccountFromProxyProvider(_x) {
  return _getAccountFromProxyProvider.apply(this, arguments);
}

function _getAccountFromProxyProvider() {
  _getAccountFromProxyProvider = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(address) {
    var proxy;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            proxy = getProxyProvider();
            _context.next = 4;
            return proxy.getAccount(new Address$1(address));

          case 4:
            return _context.abrupt("return", _context.sent);

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", null);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));
  return _getAccountFromProxyProvider.apply(this, arguments);
}

function getNetworkConfigFromProxyProvider() {
  return _getNetworkConfigFromProxyProvider.apply(this, arguments);
}

function _getNetworkConfigFromProxyProvider() {
  _getNetworkConfigFromProxyProvider = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2() {
    return runtime_1.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return getProxyProvider().getNetworkConfig();

          case 3:
            return _context2.abrupt("return", _context2.sent);

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](0);
            console.error('error fetching network config');
            return _context2.abrupt("return", null);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 6]]);
  }));
  return _getNetworkConfigFromProxyProvider.apply(this, arguments);
}

function getAccount(address) {
  return getAccountFromProxyProvider(address);
}

// without getting access to store.dispatch function

function setNonce(nonce) {
  store.dispatch(setAccountNonce(nonce));
}

function getLatestNonce(account) {
  var appState = store.getState();
  var currentAccountNonce = accountNonceSelector(appState);

  if (!account) {
    return currentAccountNonce;
  }

  return currentAccountNonce && !isNaN(currentAccountNonce) ? Math.max(currentAccountNonce, account.nonce.valueOf()) : account.nonce.valueOf();
}

function getAccountBalance(_x) {
  return _getAccountBalance.apply(this, arguments);
}

function _getAccountBalance() {
  _getAccountBalance = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(address) {
    var _account$balance;

    var accountAddress, _account, account;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accountAddress = address;

            if (accountAddress == null) {
              _account = accountSelector(store.getState());
              accountAddress = _account.address;
            }

            _context.next = 4;
            return getAccount(accountAddress);

          case 4:
            account = _context.sent;

            if (!(account == null)) {
              _context.next = 7;
              break;
            }

            throw 'Could not read account, user not logged in';

          case 7:
            return _context.abrupt("return", account == null ? void 0 : (_account$balance = account.balance) == null ? void 0 : _account$balance.toString());

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getAccountBalance.apply(this, arguments);
}

var setNewAccount = /*#__PURE__*/function () {
  var _ref = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
    var address, account, accountData;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return getAddress();

          case 3:
            address = _context.sent;
            _context.prev = 4;
            _context.next = 7;
            return getAccount(address);

          case 7:
            account = _context.sent;

            if (!(account != null)) {
              _context.next = 12;
              break;
            }

            accountData = {
              balance: account.balance.toString(),
              address: address,
              nonce: getLatestNonce(account)
            };
            store.dispatch(setAccount(accountData));
            return _context.abrupt("return", accountData);

          case 12:
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](4);
            console.error('Failed getting account ', _context.t0);

          case 17:
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t1 = _context["catch"](0);
            console.error('Failed getting address ', _context.t1);

          case 22:
            return _context.abrupt("return", null);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 19], [4, 14]]);
  }));

  return function setNewAccount() {
    return _ref.apply(this, arguments);
  };
}();

function refreshAccount() {
  return _refreshAccount.apply(this, arguments);
}

function _refreshAccount() {
  _refreshAccount = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2() {
    var provider, initialized;
    return runtime_1.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            provider = getAccountProvider();

            if (!(provider == null)) {
              _context2.next = 3;
              break;
            }

            throw 'Provider not initialized';

          case 3:
            if (!provider.isInitialized()) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", setNewAccount());

          case 7:
            _context2.prev = 7;
            _context2.next = 10;
            return provider.init();

          case 10:
            initialized = _context2.sent;

            if (initialized) {
              _context2.next = 13;
              break;
            }

            return _context2.abrupt("return");

          case 13:
            return _context2.abrupt("return", setNewAccount());

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](7);
            console.error('Failed initializing provider ', _context2.t0);

          case 19:
            return _context2.abrupt("return", undefined);

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[7, 16]]);
  }));
  return _refreshAccount.apply(this, arguments);
}

var isAddressOfMetachain = function isAddressOfMetachain(pubKey) {
  // prettier-ignore
  var metachainPrefix = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  var pubKeyPrefix = pubKey.slice(0, metachainPrefix.length);

  if (pubKeyPrefix.equals(metachainPrefix)) {
    return true;
  }

  var zeroAddress = Buffer.alloc(32).fill(0);
  return pubKey.equals(zeroAddress);
};

var getShardOfAddress = function getShardOfAddress(hexPubKey) {
  try {
    var numShards = 3;
    var maskHigh = parseInt('11', 2);
    var maskLow = parseInt('01', 2);
    var pubKey = Buffer.from(hexPubKey, 'hex');
    var lastByteOfPubKey = pubKey[31];

    if (isAddressOfMetachain(pubKey)) {
      return 4294967295;
    }

    var shard = lastByteOfPubKey & maskHigh;

    if (shard > numShards - 1) {
      shard = lastByteOfPubKey & maskLow;
    }

    return shard;
  } catch (err) {
    return -1;
  }
};

function signMessage(_x) {
  return _signMessage.apply(this, arguments);
}

function _signMessage() {
  _signMessage = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(_ref) {
    var message, callbackRoute, address, provider, callbackUrl, signableMessage, signedMessage;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            message = _ref.message, callbackRoute = _ref.callbackRoute;
            _context.next = 3;
            return getAddress();

          case 3:
            address = _context.sent;
            provider = getAccountProvider();
            callbackUrl = "" + window.location.origin + callbackRoute;
            signableMessage = new SignableMessage({
              address: new Address(address),
              message: Buffer.from(message, 'ascii')
            });
            _context.next = 9;
            return provider.signMessage(signableMessage, {
              callbackUrl: encodeURIComponent(callbackUrl)
            });

          case 9:
            signedMessage = _context.sent;
            return _context.abrupt("return", signedMessage);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _signMessage.apply(this, arguments);
}

function loginWithExternalProvider(address) {
  store.dispatch(loginAction({
    address: address,
    loginMethod: LoginMethodsEnum.extra
  }));
}

var logarithmicRest = function logarithmicRest(position) {
  var minp = 0;
  var maxp = 10;
  var minv = Math.log(0.005);
  var maxv = Math.log(2);
  var scale = (maxv - minv) / (maxp - minp);
  return Math.exp(minv + scale * (position - minp));
};

var stringIsInteger = function stringIsInteger(integer, positiveNumbersOnly) {
  if (positiveNumbersOnly === void 0) {
    positiveNumbersOnly = true;
  }

  var stringInteger = String(integer);

  if (!stringInteger.match(/^[-]?\d+$/)) {
    return false;
  }

  var bNparsed = new BigNumber(stringInteger);
  var limit = positiveNumbersOnly ? 0 : -1;
  return bNparsed.toString(10) === stringInteger && bNparsed.comparedTo(0) >= limit;
};

var stringIsFloat = function stringIsFloat(amount) {
  // tslint:disable-next-line
  var _amount$split = amount.split('.'),
      wholes = _amount$split[0],
      decimals = _amount$split[1];

  if (decimals) {
    while (decimals.charAt(decimals.length - 1) === '0') {
      decimals = decimals.slice(0, -1);
    }
  }

  var number = decimals ? [wholes, decimals].join('.') : wholes;
  var bNparsed = new BigNumber(number);
  return bNparsed.toString(10) === number && bNparsed.comparedTo(0) >= 0;
};

var esdtParts = 2;
var nftParts = 3;
var defaultResult = {
  isEsdt: false,
  isNft: false,
  isEgld: false
};
function getIdentifierType(identifier) {
  var parts = identifier == null ? void 0 : identifier.split('-').length;

  if (parts === esdtParts) {
    return _extends({}, defaultResult, {
      isEsdt: true
    });
  }

  if (parts === nftParts) {
    return _extends({}, defaultResult, {
      isNft: true
    });
  }

  return _extends({}, defaultResult, {
    isEgld: true
  });
}

function pipe(previous) {
  return {
    "if": function _if(condition) {
      if (condition) {
        return {
          then: function then(newValue) {
            return (// if a callback is passed, callback is executed with previous value
              newValue instanceof Function ? pipe(newValue(previous)) : pipe(newValue)
            );
          }
        };
      } else {
        return {
          then: function then() {
            return pipe(previous);
          }
        };
      }
    },
    then: function then(newValue) {
      return newValue instanceof Function ? pipe(newValue(previous)) : pipe(newValue);
    },
    valueOf: function valueOf() {
      return previous;
    }
  };
}

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_FLOOR
});
function denominate(_ref) {
  var input = _ref.input,
      _ref$denomination = _ref.denomination,
      denomination$1 = _ref$denomination === void 0 ? denomination : _ref$denomination,
      _ref$decimals = _ref.decimals,
      decimals$1 = _ref$decimals === void 0 ? decimals : _ref$decimals,
      _ref$showLastNonZeroD = _ref.showLastNonZeroDecimal,
      showLastNonZeroDecimal = _ref$showLastNonZeroD === void 0 ? true : _ref$showLastNonZeroD,
      _ref$showIsLessThanDe = _ref.showIsLessThanDecimalsLabel,
      showIsLessThanDecimalsLabel = _ref$showIsLessThanDe === void 0 ? false : _ref$showIsLessThanDe,
      _ref$addCommas = _ref.addCommas,
      addCommas = _ref$addCommas === void 0 ? false : _ref$addCommas;
  var token = new Token({
    decimals: denomination$1
  });

  if (typeof input === 'string' && !stringIsInteger(input, false)) {
    throw new Error('Invalid input');
  }

  return pipe(input) // denominate
  ["if"](typeof input === 'string').then(function () {
    return new Balance(token, 0, new BigNumber(input)).toDenominated();
  })["if"](input.constructor === Balance).then(function () {
    return input.toDenominated();
  }) // format
  .then(function (current) {
    var bnBalance = new BigNumber(current);

    if (bnBalance.isZero()) {
      return '0';
    }

    var balance = bnBalance.toString(10);

    var _balance$split = balance.split('.'),
        integerPart = _balance$split[0],
        decimalPart = _balance$split[1];

    var bNdecimalPart = new BigNumber(decimalPart || 0);
    var decimalPlaces = pipe(0)["if"](Boolean(decimalPart && showLastNonZeroDecimal)).then(function () {
      return Math.max(decimalPart.length, decimals$1);
    })["if"](bNdecimalPart.isZero() && !showLastNonZeroDecimal).then(0)["if"](Boolean(decimalPart && !showLastNonZeroDecimal)).then(function () {
      return Math.min(decimalPart.length, decimals$1);
    }).valueOf();
    var shownDecimalsAreZero = decimalPart && decimals$1 >= 1 && decimals$1 <= decimalPart.length && bNdecimalPart.isGreaterThan(0) && new BigNumber(decimalPart.substring(0, decimals$1)).isZero();
    var formatted = bnBalance.toFormat(decimalPlaces);
    var formattedBalance = pipe(balance)["if"](addCommas).then(formatted)["if"](Boolean(shownDecimalsAreZero)).then(function (current) {
      var integerPartZero = new BigNumber(integerPart).isZero();

      var _current$split = current.split('.'),
          numericPart = _current$split[0],
          decimalSide = _current$split[1];

      var zeroPlaceholders = new Array(decimals$1 - 1).fill(0);
      var zeros = [].concat(zeroPlaceholders, [0]).join('');
      var minAmount = [].concat(zeroPlaceholders, [1]).join(''); // 00..1

      if (!integerPartZero) {
        return numericPart + "." + zeros;
      }

      if (showIsLessThanDecimalsLabel) {
        return "<" + numericPart + "." + minAmount;
      }

      return numericPart + "." + decimalSide;
    })["if"](Boolean(!shownDecimalsAreZero && decimalPart)).then(function (current) {
      if (showLastNonZeroDecimal) {
        return current;
      }

      var _current$split2 = current.split('.'),
          numericPart = _current$split2[0];

      var decimalSide = decimalPart.substring(0, decimalPlaces);

      if (!decimalSide) {
        return numericPart;
      }

      return numericPart + "." + decimalSide;
    }).valueOf();
    return formattedBalance;
  }).valueOf();
}

function nominate(input, customDenomination) {
  var balance = createBalanceBuilder(new Token$1({
    decimals: customDenomination || denomination,
    type: TokenType.Fungible
  }));
  return balance(input).toString();
}

var placeholderData = {
  from: 'erd12dnfhej64s6c56ka369gkyj3hwv5ms0y5rxgsk2k7hkd2vuk7rvqxkalsa',
  to: 'erd12dnfhej64s6c56ka369gkyj3hwv5ms0y5rxgsk2k7hkd2vuk7rvqxkalsa'
};
function calculateFeeLimit(_ref) {
  var _ref$minGasLimit = _ref.minGasLimit,
      minGasLimit = _ref$minGasLimit === void 0 ? '50000' : _ref$minGasLimit,
      gasLimit = _ref.gasLimit,
      gasPrice = _ref.gasPrice,
      inputData = _ref.data,
      gasPerDataByte = _ref.gasPerDataByte,
      gasPriceModifier = _ref.gasPriceModifier,
      _ref$defaultGasPrice = _ref.defaultGasPrice,
      defaultGasPrice = _ref$defaultGasPrice === void 0 ? '1000000000' : _ref$defaultGasPrice,
      chainId = _ref.chainId;
  var data = inputData || '';
  var validGasLimit = stringIsInteger(gasLimit) ? gasLimit : minGasLimit;
  var validGasPrice = stringIsFloat(gasPrice) ? gasPrice : defaultGasPrice;
  var transaction = new Transaction({
    nonce: new Nonce(0),
    value: Balance.Zero(),
    receiver: new Address(placeholderData.to),
    gasPrice: new GasPrice(parseInt(validGasPrice)),
    gasLimit: new GasLimit(parseInt(validGasLimit)),
    data: new TransactionPayload(data.trim()),
    chainID: new ChainID(chainId),
    version: new TransactionVersion(1)
  });
  var networkConfig = new NetworkConfig();
  networkConfig.MinGasLimit = new GasLimit(parseInt(minGasLimit));
  networkConfig.GasPerDataByte = parseInt(gasPerDataByte);
  networkConfig.GasPriceModifier = new GasPriceModifier(parseFloat(gasPriceModifier));

  try {
    var bNfee = transaction.computeFee(networkConfig);
    var fee = bNfee.toString(10);
    return fee;
  } catch (err) {
    return '0';
  }
}

var getUsdValue = function getUsdValue(_ref) {
  var amount = _ref.amount,
      usd = _ref.usd,
      _ref$decimals = _ref.decimals,
      decimals = _ref$decimals === void 0 ? 2 : _ref$decimals;
  var sum = (parseFloat(amount) * usd).toFixed(decimals);
  return parseFloat(sum).toLocaleString('en', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  });
};

var ESDTTransferTypes = ['ESDTNFTTransfer', 'ESDTNFTBurn', 'ESDTNFTAddQuantity', 'ESDTNFTCreate', 'MultiESDTNFTTransfer', 'ESDTTransfer', 'ESDTBurn', 'ESDTLocalMint', 'ESDTLocalBurn', 'ESDTWipe', 'ESDTFreeze'];
function isContract(receiver, sender, data) {
  if (data === void 0) {
    data = '';
  }

  var isValid = addressIsValid(receiver);

  if (!isValid) {
    return false;
  }

  var isContract = new Address(receiver).isContractAddress();

  if (isContract) {
    return true;
  }

  var extractedAddress = getAddressFromDataField({
    receiver: receiver,
    data: data
  });

  if (!extractedAddress) {
    return false;
  }

  var isExtractedAddressContractCall = new Address(extractedAddress).isContractAddress();
  return isExtractedAddressContractCall || isSelfESDTContract(receiver, sender, data);
}

var isHexValidCharacters = function isHexValidCharacters(str) {
  return str.toLowerCase().match(/[0-9a-f]/g);
};

var isHexValidLength = function isHexValidLength(str) {
  return str.length % 2 === 0;
};

function isSelfESDTContract(receiver, sender, data) {
  var parts = data == null ? void 0 : data.split('@');

  if (parts == null) {
    return false;
  }

  var type = parts[0],
      restParts = parts.slice(1);
  var isSelfTransaction = sender != null && receiver != null && receiver === sender;
  var isCorrectESDTType = ESDTTransferTypes.includes(type);
  var areDataPartsValid = restParts.every(function (part) {
    return isHexValidCharacters(part) && isHexValidLength(part);
  });
  return isSelfTransaction && isCorrectESDTType && areDataPartsValid;
}
function getAddressFromDataField(_ref) {
  var receiver = _ref.receiver,
      data = _ref.data;

  try {
    if (!data) {
      return receiver;
    }

    var parsedData = isStringBase64(data) ? TransactionPayload.fromEncoded(data).toString() : data;
    var addressIndex = getAddressIndex(parsedData);
    var parts = parsedData.split('@');
    return addressIndex > -1 ? parts[addressIndex] : receiver;
  } catch (err) {
    console.log(err);
    return;
  }
}

function getAddressIndex(data) {
  if (data.includes(TypesOfSmartContractCallsEnum.MultiESDTNFTTransfer)) {
    return 1;
  }

  if (data.includes(TypesOfSmartContractCallsEnum.ESDTNFTTransfer)) {
    return 4;
  }

  return -1;
}

var classnames = {};

try {
  classnames = /*#__PURE__*/require('classnames');
} catch (err) {}

var classnames$1 = classnames;

function getGeneratedClasses(className, shouldRenderDefaultCss, defaultStyles) {
  return Object.entries(defaultStyles).reduce(function (acc, _ref) {
    var key = _ref[0],
        defaultClassNames = _ref[1];
    acc[key] = classnames$1 == null ? void 0 : classnames$1(className + "_" + key, shouldRenderDefaultCss && defaultClassNames);
    return acc;
  }, {});
}

var wrapperClassName = 'dapp-core-ui-component';

var defaultContextValue = null;
var DappCoreContext = /*#__PURE__*/React__default.createContext(defaultContextValue);
var useDispatch = /*#__PURE__*/createDispatchHook(DappCoreContext);
var useSelector = /*#__PURE__*/createSelectorHook(DappCoreContext);

var useExtensionLogin = function useExtensionLogin(_ref) {
  var callbackRoute = _ref.callbackRoute,
      token = _ref.token,
      _ref$redirectAfterLog = _ref.redirectAfterLogin,
      redirectAfterLogin = _ref$redirectAfterLog === void 0 ? false : _ref$redirectAfterLog;

  var _useState = useState(''),
      error = _useState[0],
      setError = _useState[1];

  var _useState2 = useState(false),
      isLoading = _useState2[0],
      setIsLoading = _useState2[1];

  var isLoggedIn = useSelector(isLoggedInSelector);
  var dispatch = useDispatch();

  function initiateLogin() {
    return _initiateLogin.apply(this, arguments);
  }

  function _initiateLogin() {
    _initiateLogin = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var provider, isSuccessfullyInitialized, callbackUrl, providerLoginData, _provider$account, signature, address;

      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              setIsLoading(true);
              provider = ExtensionProvider.getInstance();
              _context.prev = 2;
              _context.next = 5;
              return provider.init();

            case 5:
              isSuccessfullyInitialized = _context.sent;

              if (isSuccessfullyInitialized) {
                _context.next = 9;
                break;
              }

              console.warn('Something went wrong trying to redirect to wallet login..');
              return _context.abrupt("return");

            case 9:
              callbackUrl = encodeURIComponent("" + window.location.origin + callbackRoute);
              providerLoginData = _extends({
                callbackUrl: callbackUrl
              }, token && {
                token: token
              });
              _context.next = 13;
              return provider.login(providerLoginData);

            case 13:
              setAccountProvider(provider);
              _provider$account = provider.account, signature = _provider$account.signature, address = _provider$account.address;

              if (signature) {
                dispatch(setTokenLogin({
                  loginToken: String(token),
                  signature: signature
                }));
              }

              dispatch(loginAction({
                address: address,
                loginMethod: LoginMethodsEnum.extension
              }));
              optionalRedirect(callbackRoute, redirectAfterLogin);
              _context.next = 24;
              break;

            case 20:
              _context.prev = 20;
              _context.t0 = _context["catch"](2);
              console.error('error loging in', _context.t0); // TODO: can be any or typed error

              setError('error logging in' + _context.t0.message);

            case 24:
              _context.prev = 24;
              setIsLoading(false);
              return _context.finish(24);

            case 27:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 20, 24, 27]]);
    }));
    return _initiateLogin.apply(this, arguments);
  }

  var loginFailed = Boolean(error);
  return [initiateLogin, {
    loginFailed: loginFailed,
    error: error,
    isLoading: isLoading && !loginFailed,
    isLoggedIn: isLoggedIn && !loginFailed
  }];
};

var useWebWalletLogin = function useWebWalletLogin(_ref) {
  var callbackRoute = _ref.callbackRoute,
      token = _ref.token;

  var _useState = useState(''),
      error = _useState[0],
      setError = _useState[1];

  var _useState2 = useState(false),
      isLoading = _useState2[0],
      setIsLoading = _useState2[1];

  var isLoggedIn = useSelector(isLoggedInSelector);

  function initiateLogin() {
    return _initiateLogin.apply(this, arguments);
  }

  function _initiateLogin() {
    _initiateLogin = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var appState, network, provider, now, expires, walletLoginData, callbackUrl, loginData;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              setIsLoading(true);
              appState = store.getState();
              network = networkSelector(appState);
              provider = newWalletProvider(network.walletAddress);
              now = new Date();
              expires = now.setMinutes(now.getMinutes() + 3) / 1000;
              walletLoginData = {
                data: {},
                expires: expires
              };
              store.dispatch(setWalletLogin(walletLoginData));
              callbackUrl = encodeURIComponent("" + window.location.origin + callbackRoute);
              loginData = _extends({
                callbackUrl: callbackUrl
              }, token && {
                token: token
              });
              _context.next = 13;
              return provider.login(loginData);

            case 13:
              _context.next = 19;
              break;

            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](0);
              console.error(_context.t0);
              setError('error logging in' + _context.t0.message);

            case 19:
              _context.prev = 19;
              setIsLoading(false);
              return _context.finish(19);

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 15, 19, 22]]);
    }));
    return _initiateLogin.apply(this, arguments);
  }

  var loginFailed = error != null;
  return [initiateLogin, {
    error: error,
    loginFailed: loginFailed,
    isLoading: isLoading && !loginFailed,
    isLoggedIn: isLoggedIn && !loginFailed
  }];
};

var ledgerAppErrorText = 'Check if Elrond app is open on Ledger';
var failInitializeErrorText = 'Could not initialise ledger app, make sure Elrond app is open';
var defaultAddressesPerPage = 10;
function useLedgerLogin(_ref) {
  var callbackRoute = _ref.callbackRoute,
      token = _ref.token,
      _ref$addressesPerPage = _ref.addressesPerPage,
      addressesPerPage = _ref$addressesPerPage === void 0 ? defaultAddressesPerPage : _ref$addressesPerPage,
      _ref$redirectAfterLog = _ref.redirectAfterLogin,
      redirectAfterLogin = _ref$redirectAfterLog === void 0 ? false : _ref$redirectAfterLog;
  var ledgerAccount = useSelector(ledgerAccountSelector);
  var isLoggedIn = useSelector(isLoggedInSelector);
  var proxy = getProxyProvider();
  var dispatch = useDispatch();

  var _useState = useState(''),
      error = _useState[0],
      setError = _useState[1];

  var _useState2 = useState(false),
      isLoading = _useState2[0],
      setIsLoading = _useState2[1];

  var hwWalletP = new HWProvider(proxy);

  var _useState3 = useState(0),
      startIndex = _useState3[0],
      setStartIndex = _useState3[1];

  var _useState4 = useState([]),
      accounts = _useState4[0],
      setAccounts = _useState4[1];

  var _useState5 = useState(''),
      version = _useState5[0],
      setVersion = _useState5[1];

  var _useState6 = useState(false),
      contractDataEnabled = _useState6[0],
      setContractDataEnabled = _useState6[1];

  var _useState7 = useState(null),
      selectedAddress = _useState7[0],
      setSelectedAddress = _useState7[1];

  var _useState8 = useState(false),
      showAddressList = _useState8[0],
      setShowAddressList = _useState8[1];

  function dispatchLoginActions(_ref2) {
    var provider = _ref2.provider,
        address = _ref2.address,
        index = _ref2.index,
        signature = _ref2.signature;
    setAccountProvider(provider);
    dispatch(setLedgerLogin({
      index: index,
      loginType: LoginMethodsEnum.ledger
    }));

    if (signature) {
      dispatch(setTokenLogin({
        loginToken: String(token),
        signature: signature
      }));
    }

    dispatch(loginAction({
      address: address,
      loginMethod: LoginMethodsEnum.ledger
    }));
    optionalRedirect(callbackRoute, redirectAfterLogin);
  }

  var onLoginFailed = function onLoginFailed(err, customMessage) {
    if (err.statusCode in ledgerErrorCodes) {
      setError(ledgerErrorCodes[err.statusCode].message + customMessage);
    }

    setIsLoading(false);
    console.warn(err);
    dispatch(setLedgerAccount(null));
  };

  function loginUser(_x) {
    return _loginUser.apply(this, arguments);
  }

  function _loginUser() {
    _loginUser = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(hwWalletProvider) {
      var index, loginInfo, address;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(selectedAddress == null)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", false);

            case 2:
              index = selectedAddress.index;

              if (!token) {
                _context.next = 16;
                break;
              }

              _context.prev = 4;
              _context.next = 7;
              return hwWalletProvider.tokenLogin({
                token: Buffer.from(token + "{}"),
                addressIndex: index
              });

            case 7:
              loginInfo = _context.sent;
              dispatchLoginActions({
                address: loginInfo.address,
                provider: hwWalletProvider,
                index: index,
                signature: loginInfo.signature.hex()
              });
              _context.next = 14;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](4);
              onLoginFailed(_context.t0, '. Update Elrond App to continue.');

            case 14:
              _context.next = 27;
              break;

            case 16:
              _context.prev = 16;
              _context.next = 19;
              return hwWalletProvider.login({
                addressIndex: index
              });

            case 19:
              address = _context.sent;
              dispatchLoginActions({
                address: address,
                provider: hwWalletProvider,
                index: index
              });
              _context.next = 27;
              break;

            case 23:
              _context.prev = 23;
              _context.t1 = _context["catch"](16);
              onLoginFailed(_context.t1);
              return _context.abrupt("return", false);

            case 27:
              return _context.abrupt("return", true);

            case 28:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 11], [16, 23]]);
    }));
    return _loginUser.apply(this, arguments);
  }

  function onConfirmSelectedAddress() {
    return _onConfirmSelectedAddress.apply(this, arguments);
  }

  function _onConfirmSelectedAddress() {
    _onConfirmSelectedAddress = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2() {
      var hwWalletProvider, initialized;
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              setIsLoading(true);

              if (!(selectedAddress == null)) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return", false);

            case 4:
              if (ledgerAccount) {
                dispatch(updateLedgerAccount(selectedAddress));
              } else {
                dispatch(setLedgerAccount(_extends({}, selectedAddress, {
                  version: version,
                  hasContractDataEnabled: contractDataEnabled
                })));
              }

              hwWalletProvider = new HWProvider(proxy);
              _context2.next = 8;
              return hwWalletProvider.init();

            case 8:
              initialized = _context2.sent;

              if (initialized) {
                _context2.next = 13;
                break;
              }

              setError(failInitializeErrorText);
              console.warn(failInitializeErrorText);
              return _context2.abrupt("return", false);

            case 13:
              setIsLoading(false);
              _context2.next = 16;
              return loginUser(hwWalletProvider);

            case 16:
              _context2.next = 22;
              break;

            case 18:
              _context2.prev = 18;
              _context2.t0 = _context2["catch"](0);

              if (_context2.t0.statusCode in ledgerErrorCodes) {
                setError(ledgerErrorCodes[_context2.t0.statusCode].message);
              }

              console.warn(failInitializeErrorText, _context2.t0);

            case 22:
              _context2.prev = 22;
              setIsLoading(false);
              return _context2.finish(22);

            case 25:
              setShowAddressList(false);
              return _context2.abrupt("return", true);

            case 27:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 18, 22, 25]]);
    }));
    return _onConfirmSelectedAddress.apply(this, arguments);
  }

  function fetchAccounts() {
    return _fetchAccounts.apply(this, arguments);
  }

  function _fetchAccounts() {
    _fetchAccounts = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3() {
      var initialized, _accounts, ledgerData;

      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              setIsLoading(true);
              _context3.next = 4;
              return hwWalletP.init();

            case 4:
              initialized = _context3.sent;

              if (initialized) {
                _context3.next = 10;
                break;
              }

              setError(failInitializeErrorText);
              console.warn(failInitializeErrorText);
              setIsLoading(false);
              return _context3.abrupt("return");

            case 10:
              _context3.next = 12;
              return hwWalletP.getAccounts(startIndex, addressesPerPage);

            case 12:
              _accounts = _context3.sent;
              _context3.next = 15;
              return getLedgerConfiguration(hwWalletP);

            case 15:
              ledgerData = _context3.sent;
              setVersion(ledgerData.version);
              setContractDataEnabled(ledgerData.dataEnabled);
              setAccounts(_accounts);
              setIsLoading(false);
              _context3.next = 27;
              break;

            case 22:
              _context3.prev = 22;
              _context3.t0 = _context3["catch"](0);

              if (_context3.t0.statusCode in ledgerErrorCodes) {
                setError(ledgerErrorCodes[_context3.t0.statusCode].message);
              } else {
                setError(ledgerAppErrorText);
              }

              console.error('error', _context3.t0);
              setIsLoading(false);

            case 27:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 22]]);
    }));
    return _fetchAccounts.apply(this, arguments);
  }

  function onStartLogin() {
    return _onStartLogin.apply(this, arguments);
  }

  function _onStartLogin() {
    _onStartLogin = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4() {
      var _hwWalletP, initialized, address;

      return runtime_1.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              setError('');
              _context4.prev = 1;
              setIsLoading(true);

              if (!(ledgerAccount != null)) {
                _context4.next = 19;
                break;
              }

              _hwWalletP = new HWProvider(proxy);
              _context4.next = 7;
              return _hwWalletP.init();

            case 7:
              initialized = _context4.sent;

              if (initialized) {
                _context4.next = 11;
                break;
              }

              console.warn(failInitializeErrorText);
              return _context4.abrupt("return");

            case 11:
              _context4.next = 13;
              return _hwWalletP.login({
                addressIndex: selectedAddress == null ? void 0 : selectedAddress.index
              });

            case 13:
              address = _context4.sent;
              setAccountProvider(_hwWalletP);
              dispatch(loginAction({
                address: address,
                loginMethod: LoginMethodsEnum.ledger
              }));
              optionalRedirect(callbackRoute, redirectAfterLogin);
              _context4.next = 26;
              break;

            case 19:
              if (!((accounts == null ? void 0 : accounts.length) > 0)) {
                _context4.next = 23;
                break;
              }

              setShowAddressList(true);
              _context4.next = 26;
              break;

            case 23:
              _context4.next = 25;
              return fetchAccounts();

            case 25:
              setShowAddressList(true);

            case 26:
              _context4.next = 32;
              break;

            case 28:
              _context4.prev = 28;
              _context4.t0 = _context4["catch"](1);
              console.error('error ', _context4.t0);
              setError(ledgerAppErrorText);

            case 32:
              _context4.prev = 32;
              setIsLoading(false);
              return _context4.finish(32);

            case 35:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[1, 28, 32, 35]]);
    }));
    return _onStartLogin.apply(this, arguments);
  }

  function onSelectAddress(newSelectedAddress) {
    setSelectedAddress(newSelectedAddress);
  }

  function onGoToNextPage() {
    setSelectedAddress(null);
    setStartIndex(function (current) {
      return current + 1;
    });
  }

  function onGoToPrevPage() {
    setSelectedAddress(null);
    setStartIndex(function (current) {
      return current === 0 ? 0 : current - 1;
    });
  }

  useEffect(function () {
    fetchAccounts();
  }, [startIndex]);
  var loginFailed = Boolean(error);
  return [onStartLogin, {
    loginFailed: loginFailed,
    isLoggedIn: isLoggedIn && !loginFailed,
    error: error,
    isLoading: isLoading && !loginFailed
  }, {
    accounts: accounts,
    showAddressList: showAddressList,
    startIndex: startIndex,
    selectedAddress: selectedAddress,
    version: version,
    contractDataEnabled: contractDataEnabled,
    onGoToPrevPage: onGoToPrevPage,
    onGoToNextPage: onGoToNextPage,
    onSelectAddress: onSelectAddress,
    onConfirmSelectedAddress: onConfirmSelectedAddress
  }];
}

function useUpdateEffect(effect, dependencies) {
  if (dependencies === void 0) {
    dependencies = [];
  }

  var isInitialMount = useRef(true);
  useEffect(function () {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effect();
    }
  }, dependencies);
}

var useWalletConnectLogin = function useWalletConnectLogin(_ref) {
  var callbackRoute = _ref.callbackRoute,
      logoutRoute = _ref.logoutRoute,
      token = _ref.token,
      _ref$redirectAfterLog = _ref.redirectAfterLogin,
      redirectAfterLogin = _ref$redirectAfterLog === void 0 ? false : _ref$redirectAfterLog;
  var dispatch = useDispatch();
  var heartbeatInterval = 15000;

  var _useState = useState(''),
      error = _useState[0],
      setError = _useState[1];

  var _useState2 = useState(''),
      wcUri = _useState2[0],
      setWcUri = _useState2[1];

  var proxy = getProxyProvider();
  var provider = getAccountProvider();
  var walletConnectBridgeAddress = useSelector(walletConnectBridgeAddressSelector);
  var walletConnectDeepLink = useSelector(walletConnectDeepLinkSelector);
  var isLoggedIn = useSelector(isLoggedInSelector);
  var providerRef = useRef(provider);
  var heartbeatDisconnectInterval;
  var hasWcUri = Boolean(wcUri);
  var isLoading = !hasWcUri;
  var uriDeepLink = hasWcUri ? walletConnectDeepLink + "?wallet-connect=" + encodeURIComponent(wcUri) : null;
  useEffect(function () {
    handleHeartbeat();
    var interval = setInterval(function () {
      handleHeartbeat();
    }, heartbeatInterval);
    return function () {
      return clearInterval(interval);
    };
  }, [provider]);
  useUpdateEffect(function () {
    generateWcUri();
  }, [token]);
  useUpdateEffect(function () {
    providerRef.current = provider;
  }, [provider]);

  function handleHeartbeat() {
    return _handleHeartbeat.apply(this, arguments);
  }

  function _handleHeartbeat() {
    _handleHeartbeat = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var _providerRef$current, _providerRef$current$;

      var isProviderConnected, customMessage;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              isProviderConnected = Boolean((_providerRef$current = providerRef.current) == null ? void 0 : (_providerRef$current$ = _providerRef$current.walletConnector) == null ? void 0 : _providerRef$current$.connected);

              if (isProviderConnected) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              customMessage = {
                method: 'heartbeat',
                params: {}
              };
              _context.prev = 4;
              _context.next = 7;
              return providerRef.current.sendCustomMessage(customMessage);

            case 7:
              _context.next = 13;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](4);
              console.error('Connection lost', _context.t0);
              handleOnLogout();

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 9]]);
    }));
    return _handleHeartbeat.apply(this, arguments);
  }

  function handleOnLogin() {
    return _handleOnLogin.apply(this, arguments);
  }

  function _handleOnLogin() {
    _handleOnLogin = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2() {
      var _provider, address, signature, hasSignature, loginActionData, loginData;

      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _provider = providerRef.current;

              if (!isLoggedIn) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return");

            case 4:
              if (!(_provider == null)) {
                _context2.next = 6;
                break;
              }

              return _context2.abrupt("return");

            case 6:
              _context2.next = 8;
              return _provider.getAddress();

            case 8:
              address = _context2.sent;
              _context2.next = 11;
              return _provider.getSignature();

            case 11:
              signature = _context2.sent;
              hasSignature = Boolean(signature);
              loginActionData = {
                address: address,
                loginMethod: LoginMethodsEnum.walletconnect
              };
              loginData = {
                logoutRoute: logoutRoute,
                loginType: 'walletConnect',
                callbackRoute: callbackRoute
              };

              if (hasSignature) {
                dispatch(setWalletConnectLogin(loginData));
                dispatch(setTokenLoginSignature(signature));
              } else {
                dispatch(setWalletConnectLogin(loginData));
              }

              dispatch(loginAction(loginActionData));

              _provider.walletConnector.on('heartbeat', function () {
                clearInterval(heartbeatDisconnectInterval);
                heartbeatDisconnectInterval = setInterval(function () {
                  console.log('Maiar Wallet Connection Lost');
                  handleOnLogout();
                  clearInterval(heartbeatDisconnectInterval);
                }, 150000);
              });

              optionalRedirect(callbackRoute, redirectAfterLogin);
              _context2.next = 25;
              break;

            case 21:
              _context2.prev = 21;
              _context2.t0 = _context2["catch"](0);
              setError('Invalid address');
              console.error(_context2.t0);

            case 25:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 21]]);
    }));
    return _handleOnLogin.apply(this, arguments);
  }

  var handleOnLogout = function handleOnLogout() {
    logout(logoutRoute);
  };

  function initiateLogin(_x) {
    return _initiateLogin.apply(this, arguments);
  }

  function _initiateLogin() {
    _initiateLogin = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(loginProvider) {
      var _providerRef$current2;

      var shouldGenerateWcUri, providerHandlers, newProvider;
      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (loginProvider === void 0) {
                loginProvider = true;
              }

              shouldGenerateWcUri = loginProvider && !wcUri;

              if (!(!walletConnectBridgeAddress || providerRef != null && (_providerRef$current2 = providerRef.current) != null && _providerRef$current2.isInitialized != null && _providerRef$current2.isInitialized() && !shouldGenerateWcUri)) {
                _context3.next = 4;
                break;
              }

              return _context3.abrupt("return");

            case 4:
              providerHandlers = {
                onClientLogin: handleOnLogin,
                onClientLogout: handleOnLogout
              };
              newProvider = new WalletConnectProvider(proxy, walletConnectBridgeAddress, providerHandlers);
              _context3.next = 8;
              return newProvider.init();

            case 8:
              setAccountProvider(newProvider);
              providerRef.current = newProvider;

              if (loginProvider) {
                generateWcUri();
              }

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _initiateLogin.apply(this, arguments);
  }

  function generateWcUri() {
    return _generateWcUri.apply(this, arguments);
  }

  function _generateWcUri() {
    _generateWcUri = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4() {
      var _providerRef$current3;

      var walletConnectUri, hasUri, wcUriWithToken;
      return runtime_1.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (walletConnectBridgeAddress) {
                _context4.next = 2;
                break;
              }

              return _context4.abrupt("return");

            case 2:
              _context4.next = 4;
              return (_providerRef$current3 = providerRef.current) == null ? void 0 : _providerRef$current3.login();

            case 4:
              walletConnectUri = _context4.sent;
              hasUri = Boolean(walletConnectUri);

              if (hasUri) {
                _context4.next = 8;
                break;
              }

              return _context4.abrupt("return");

            case 8:
              if (token) {
                _context4.next = 11;
                break;
              }

              setWcUri(walletConnectUri);
              return _context4.abrupt("return");

            case 11:
              wcUriWithToken = walletConnectUri + "&token=" + token;
              setWcUri(wcUriWithToken);
              dispatch(setTokenLogin({
                loginToken: token
              }));

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _generateWcUri.apply(this, arguments);
  }

  var loginFailed = error != null;
  return [initiateLogin, {
    error: error,
    loginFailed: loginFailed,
    isLoading: isLoading && !loginFailed,
    isLoggedIn: isLoggedIn && !loginFailed
  }, {
    uriDeepLink: uriDeepLink,
    walletConnectUri: wcUri
  }];
};



var index$1 = {
  __proto__: null,
  useExtensionLogin: useExtensionLogin,
  useWebWalletLogin: useWebWalletLogin,
  useLedgerLogin: useLedgerLogin,
  useWalletConnectLogin: useWalletConnectLogin
};

function removeTransactionsToSign(sessionId) {
  store.dispatch(clearSignedTransaction(sessionId));
}
function removeSignedTransaction(sessionId) {
  store.dispatch(clearSignedTransaction(sessionId));
}
function removeAllSignedTransactions() {
  store.dispatch(clearAllSignedTransactions());
}
function removeAllTransactionsToSign() {
  store.dispatch(clearAllTransactionsToSign());
}

function calcTotalFee(transactions, minGasLimit) {
  var totalFee = new BigNumber(0);
  transactions.forEach(function (tx) {
    var fee = calculateFeeLimit({
      gasPerDataByte: gasPerDataByte,
      gasPriceModifier: gasPriceModifier,
      minGasLimit: String(minGasLimit),
      gasLimit: tx.getGasLimit().valueOf().toString(),
      gasPrice: tx.getGasPrice().valueOf().toString(),
      data: tx.getData().toString(),
      chainId: tx.getChainID().valueOf()
    });
    totalFee = totalFee.plus(new BigNumber(fee));
  });
  return totalFee;
}

function signTransactions(_ref) {
  var transactions = _ref.transactions,
      callbackRoute = _ref.callbackRoute,
      _ref$minGasLimit = _ref.minGasLimit,
      minGasLimit = _ref$minGasLimit === void 0 ? DEFAULT_MIN_GAS_LIMIT : _ref$minGasLimit,
      customTransactionInformation = _ref.customTransactionInformation,
      transactionsDisplayInfo = _ref.transactionsDisplayInfo;
  var appState = store.getState();
  var sessionId = Date.now().toString();
  var accountBalance = accountBalanceSelector(appState);
  var storeChainId = chainIDSelector(appState);
  var transactionsPayload = Array.isArray(transactions) ? transactions : [transactions];
  var bNtotalFee = calcTotalFee(transactionsPayload, minGasLimit);
  var bNbalance = new BigNumber(stringIsFloat(accountBalance) ? accountBalance : '0');
  var hasSufficientFunds = bNbalance.minus(bNtotalFee).isGreaterThan(0);

  if (!hasSufficientFunds) {
    var notificationPayload = {
      type: NotificationTypesEnum.warning,
      iconClassName: 'text-warning',
      title: 'Insufficient EGLD funds',
      description: 'Current EGLD balance cannot cover the transaction fees.'
    };
    store.dispatch(setNotificationModal(notificationPayload));
    return {
      error: 'insufficient funds',
      sessionId: null
    };
  }

  var hasValidChainId = transactionsPayload == null ? void 0 : transactionsPayload.every(function (tx) {
    return tx.getChainID().valueOf() === storeChainId.valueOf();
  });

  if (!hasValidChainId) {
    var _notificationPayload = {
      type: NotificationTypesEnum.warning,
      iconClassName: 'text-warning',
      title: 'Network change detected',
      description: 'The application tried to change the transaction network'
    };
    store.dispatch(setNotificationModal(_notificationPayload));
    return {
      error: 'Invalid ChainID',
      sessionId: null
    };
  }

  var signTransactionsPayload = {
    sessionId: sessionId,
    callbackRoute: callbackRoute,
    customTransactionInformation: customTransactionInformation,
    transactions: transactionsPayload.map(function (tx) {
      return tx.toPlainObject();
    })
  };
  store.dispatch(setTransactionsToSign(signTransactionsPayload));
  store.dispatch(setTransactionsDisplayInfo({
    sessionId: sessionId,
    transactionsDisplayInfo: transactionsDisplayInfo
  }));
  return {
    sessionId: sessionId
  };
}

var ErrorCodesEnum;

(function (ErrorCodesEnum) {
  ErrorCodesEnum["invalidReceiver"] = "Invalid Receiver address";
  ErrorCodesEnum["unknownError"] = "Unknown Error. Please check the transactions and try again";
})(ErrorCodesEnum || (ErrorCodesEnum = {})); // TODO: replace with new erdjs function


function calculateGasLimit(data) {
  var bNconfigGasLimit = new BigNumber(gasLimit);
  var bNgasPerDataByte = new BigNumber(gasPerDataByte);
  var bNgasValue = data ? bNgasPerDataByte.times(Buffer.from(data).length) : 0;
  var bNgasLimit = bNconfigGasLimit.plus(bNgasValue);
  var gasLimit$1 = bNgasLimit.toString(10);
  return gasLimit$1;
}

function transformAndSignTransactions(_x) {
  return _transformAndSignTransactions.apply(this, arguments);
}

function _transformAndSignTransactions() {
  _transformAndSignTransactions = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(_ref) {
    var transactions, address, account, nonce;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            transactions = _ref.transactions;
            address = addressSelector(store.getState());
            _context.next = 4;
            return getAccount(address);

          case 4:
            account = _context.sent;
            nonce = getLatestNonce(account);
            return _context.abrupt("return", transactions.map(function (tx) {
              var value = tx.value,
                  receiver = tx.receiver,
                  _tx$data = tx.data,
                  data = _tx$data === void 0 ? '' : _tx$data,
                  chainID = tx.chainID,
                  version = tx.version,
                  options = tx.options,
                  _tx$gasPrice = tx.gasPrice,
                  gasPrice$1 = _tx$gasPrice === void 0 ? gasPrice : _tx$gasPrice,
                  _tx$gasLimit = tx.gasLimit,
                  gasLimit = _tx$gasLimit === void 0 ? calculateGasLimit(tx.data) : _tx$gasLimit;
              var validatedReceiver = receiver;

              try {
                var addr = new Address(receiver);
                validatedReceiver = addr.hex();
              } catch (err) {
                throw ErrorCodesEnum.invalidReceiver;
              }

              var storeChainId = chainIDSelector(store.getState()).valueOf().toString();
              var transactionsChainId = chainID || storeChainId;
              return newTransaction({
                value: value,
                receiver: validatedReceiver,
                data: data,
                gasPrice: gasPrice$1,
                gasLimit: Number(gasLimit),
                nonce: Number(nonce.valueOf().toString()),
                sender: new Address(address).hex(),
                chainID: transactionsChainId,
                version: version,
                options: options
              });
            }));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _transformAndSignTransactions.apply(this, arguments);
}

function sendTransactions(_x) {
  return _sendTransactions.apply(this, arguments);
}

function _sendTransactions() {
  _sendTransactions = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(_ref) {
    var transactions, transactionsDisplayInfo, _ref$redirectAfterSig, redirectAfterSign, _ref$callbackRoute, callbackRoute, signWithoutSending, completedTransactionsDelay, sessionInformation, minGasLimit, transactionsPayload, areComplexTransactions, txToSign;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            transactions = _ref.transactions, transactionsDisplayInfo = _ref.transactionsDisplayInfo, _ref$redirectAfterSig = _ref.redirectAfterSign, redirectAfterSign = _ref$redirectAfterSig === void 0 ? true : _ref$redirectAfterSig, _ref$callbackRoute = _ref.callbackRoute, callbackRoute = _ref$callbackRoute === void 0 ? window.location.pathname : _ref$callbackRoute, signWithoutSending = _ref.signWithoutSending, completedTransactionsDelay = _ref.completedTransactionsDelay, sessionInformation = _ref.sessionInformation, minGasLimit = _ref.minGasLimit;
            _context.prev = 1;
            transactionsPayload = Array.isArray(transactions) ? transactions : [transactions];
            areComplexTransactions = transactionsPayload.every(function (tx) {
              return Object.getPrototypeOf(tx).toPlainObject != null;
            });
            txToSign = transactionsPayload;

            if (areComplexTransactions) {
              _context.next = 9;
              break;
            }

            _context.next = 8;
            return transformAndSignTransactions({
              transactions: transactionsPayload,
              minGasLimit: minGasLimit
            });

          case 8:
            txToSign = _context.sent;

          case 9:
            return _context.abrupt("return", signTransactions({
              transactions: txToSign,
              minGasLimit: minGasLimit,
              callbackRoute: callbackRoute,
              transactionsDisplayInfo: transactionsDisplayInfo,
              customTransactionInformation: {
                redirectAfterSign: redirectAfterSign,
                completedTransactionsDelay: completedTransactionsDelay,
                sessionInformation: sessionInformation,
                signWithoutSending: signWithoutSending
              }
            }));

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](1);
            console.error('error signing transaction', _context.t0);
            return _context.abrupt("return", {
              error: _context.t0,
              sessionId: null
            });

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 12]]);
  }));
  return _sendTransactions.apply(this, arguments);
}

function useTrackTransactionStatus(_ref) {
  var transactionId = _ref.transactionId,
      onSuccess = _ref.onSuccess,
      onFail = _ref.onFail,
      onCancelled = _ref.onCancelled,
      onTimedOut = _ref.onTimedOut,
      onCompleted = _ref.onCompleted;
  var transactionsBatch = useSelector(function (state) {
    return transactionStatusSelector(state, transactionId);
  });
  var status = transactionsBatch.status,
      transactions = transactionsBatch.transactions,
      errorMessage = transactionsBatch.errorMessage;
  var isPending = getIsTransactionPending(status);
  var isFailed = getIsTransactionFailed(status);
  var isTimedOut = getIsTransactionTimedOut(status);
  var isSuccessful = getIsTransactionSuccessful(status);
  var isCompleted = getIsTransactionCompleted(status);
  var isCancelled = status === TransactionBatchStatusesEnum.cancelled;
  useEffect(function () {
    if (isSuccessful && onSuccess) {
      onSuccess(transactionId);
    }
  }, [isSuccessful]);
  useEffect(function () {
    if (isCompleted && onCompleted) {
      onCompleted(transactionId);
    }
  }, [isCompleted]);
  useEffect(function () {
    if (isFailed && onFail) {
      onFail(transactionId, errorMessage);
    }
  }, [isFailed]);
  useEffect(function () {
    if (isCancelled && onCancelled) {
      onCancelled(transactionId);
    }
  }, [isCancelled]);
  useEffect(function () {
    if (isTimedOut) {
      if (onTimedOut) {
        onTimedOut(transactionId);
      } else {
        onFail == null ? void 0 : onFail(transactionId, 'timeout');
      }
    }
  }, [isTimedOut]);

  if (transactionId == null) {
    return {};
  }

  if (transactionsBatch == null) {
    return {
      errorMessage: 'No transaction to track'
    };
  }

  return {
    isPending: isPending,
    isSuccessful: isSuccessful,
    isFailed: isFailed,
    isCancelled: isCancelled,
    isCompleted: isCompleted,
    errorMessage: errorMessage,
    status: status,
    transactions: transactions
  };
}

function useGetPendingTransactions() {
  var pendingTransactions = useSelector(pendingSignedTransactionsSelector);
  var pendingTransactionsArray = Object.entries(pendingTransactions);
  var hasPendingTransactions = (pendingTransactionsArray == null ? void 0 : pendingTransactionsArray.length) > 0;
  return {
    pendingTransactions: pendingTransactions,
    pendingTransactionsArray: pendingTransactionsArray,
    hasPendingTransactions: hasPendingTransactions
  };
}

function useGetFailedTransactions() {
  var failedTransactions = useSelector(failedTransactionsSelector);
  var failedTransactionsArray = Object.entries(failedTransactions);
  var hasFailedTransactions = (failedTransactionsArray == null ? void 0 : failedTransactionsArray.length) > 0;
  return {
    failedTransactions: failedTransactions,
    failedTransactionsArray: failedTransactionsArray,
    hasFailedTransactions: hasFailedTransactions
  };
}

function useGetSuccessfulTransactions() {
  var successfulTransactions = useSelector(successfulTransactionsSelector);
  var successfulTransactionsArray = Object.entries(successfulTransactions);
  var hasSuccessfulTransactions = (successfulTransactionsArray == null ? void 0 : successfulTransactionsArray.length) > 0;
  return {
    successfulTransactions: successfulTransactions,
    successfulTransactionsArray: successfulTransactionsArray,
    hasSuccessfulTransactions: hasSuccessfulTransactions
  };
}

var defaultTransactionInfo$1 = {
  tokenId: '',
  amount: '',
  type: '',
  multiTxData: '',
  receiver: ''
};
function useParseMultiEsdtTransferData(_ref) {
  var transactions = _ref.transactions;

  var _useState = useState({}),
      parsedTransactionsByDataField = _useState[0],
      setParsedTransactions = _useState[1];

  var _useState2 = useState([]),
      allTransactions = _useState2[0],
      setAllTransactions = _useState2[1];

  function addTransactionDataToParsedInfo(data, txInfo) {
    setParsedTransactions(function (existing) {
      var _extends2;

      return _extends({}, existing, (_extends2 = {}, _extends2[data] = txInfo, _extends2));
    });
  }

  function getTxInfoByDataField(data, multiTransactionData) {
    if (parsedTransactionsByDataField == null) {
      return defaultTransactionInfo$1;
    }

    if (data in parsedTransactionsByDataField) {
      return parsedTransactionsByDataField[data];
    }

    if (multiTransactionData != null && String(multiTransactionData) in parsedTransactionsByDataField) {
      return parsedTransactionsByDataField[multiTransactionData];
    }

    return defaultTransactionInfo$1;
  }

  function extractTransactionESDTData() {
    if (transactions && transactions.length > 0) {
      var allTxs = [];
      transactions.forEach(function (transaction, transactionIndex) {
        var txData = transaction.getData().toString();
        var multiTxs = parseMultiEsdtTransferData(txData);

        if (multiTxs.length > 0) {
          multiTxs.forEach(function (trx, idx) {
            var newTx = {
              transaction: transaction,
              multiTxData: trx.data,
              transactionIndex: idx
            };
            addTransactionDataToParsedInfo(trx.data, {
              tokenId: trx.token ? trx.token : '',
              amount: trx.amount ? trx.amount : '',
              type: trx.type,
              nonce: trx.nonce ? trx.nonce : '',
              multiTxData: trx.data,
              receiver: trx.receiver
            });
            allTxs.push(newTx);
          });
        } else {
          var _getTokenFromData = getTokenFromData(transaction.getData().toString()),
              tokenId = _getTokenFromData.tokenId,
              amount = _getTokenFromData.amount;

          if (tokenId) {
            addTransactionDataToParsedInfo(transaction.getData().toString(), {
              tokenId: tokenId,
              amount: amount,
              receiver: transaction.getReceiver().bech32()
            });
          }

          allTxs.push({
            transaction: transaction,
            transactionIndex: transactionIndex
          });
        }
      });
      setAllTransactions(allTxs);
    }
  }

  useEffect(function () {
    extractTransactionESDTData();
  }, [transactions]);
  return {
    parsedTransactionsByDataField: parsedTransactionsByDataField,
    getTxInfoByDataField: getTxInfoByDataField,
    allTransactions: allTransactions
  };
}

function useGetActiveTransactionsStatus() {
  var _Object$keys, _Object$keys2, _Object$keys3;

  var signedTransactions = useSelector(signedTransactionsSelector);
  var timedOutTransactions = useSelector(timedOutTransactionsSelector);
  var failedTransactions = useSelector(failedTransactionsSelector);
  var successfulTransactions = useSelector(successfulTransactionsSelector);
  var pendingTransactions = useSelector(pendingSignedTransactionsSelector);
  var completedTransactions = useSelector(completedTransactionsSelector);
  var pending = ((_Object$keys = Object.keys(pendingTransactions)) == null ? void 0 : _Object$keys.length) > 0;
  var timedOut = !pending && ((_Object$keys2 = Object.keys(timedOutTransactions)) == null ? void 0 : _Object$keys2.length) > 0;
  var fail = !pending && !timedOut && ((_Object$keys3 = Object.keys(failedTransactions)) == null ? void 0 : _Object$keys3.length) > 0;
  var success = !pending && !timedOut && !fail && Object.keys(successfulTransactions).length > 0;
  var completed = !pending && !timedOut && !fail && Object.keys(completedTransactions).length > 0;
  var hasActiveTransactions = Object.keys(signedTransactions).length > 0;
  return {
    pending: pending,
    timedOut: timedOut,
    fail: fail,
    success: success,
    completed: completed,
    hasActiveTransactions: hasActiveTransactions
  };
}

function useGetCompletedTransactions() {
  var completedTransactions = useSelector(completedTransactionsSelector);
  var completedTransactionsArray = Object.entries(completedTransactions);
  var hasCompletedTransactions = (completedTransactionsArray == null ? void 0 : completedTransactionsArray.length) > 0;
  return {
    completedTransactions: completedTransactions,
    completedTransactionsArray: completedTransactionsArray,
    hasCompletedTransactions: hasCompletedTransactions
  };
}



var index$2 = {
  __proto__: null,
  removeTransactionsToSign: removeTransactionsToSign,
  removeSignedTransaction: removeSignedTransaction,
  removeAllSignedTransactions: removeAllSignedTransactions,
  removeAllTransactionsToSign: removeAllTransactionsToSign,
  sendTransactions: sendTransactions,
  signTransactions: signTransactions,
  useTrackTransactionStatus: useTrackTransactionStatus,
  useGetPendingTransactions: useGetPendingTransactions,
  useGetFailedTransactions: useGetFailedTransactions,
  useGetSuccessfulTransactions: useGetSuccessfulTransactions,
  useParseMultiEsdtTransferData: useParseMultiEsdtTransferData,
  useGetActiveTransactionsStatus: useGetActiveTransactionsStatus,
  useGetCompletedTransactions: useGetCompletedTransactions
};

function sendSignedTransactions(_x) {
  return _sendSignedTransactions.apply(this, arguments);
}

function _sendSignedTransactions() {
  _sendSignedTransactions = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(signedTransactions) {
    var _networkSelector, apiAddress, apiTimeout, promises, response;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _networkSelector = networkSelector(store.getState()), apiAddress = _networkSelector.apiAddress, apiTimeout = _networkSelector.apiTimeout;
            promises = signedTransactions.map(function (transaction) {
              return axios.post(apiAddress + "/transactions", transaction.toPlainObject(), {
                timeout: parseInt(apiTimeout)
              });
            });
            _context.next = 4;
            return Promise.all(promises);

          case 4:
            response = _context.sent;
            return _context.abrupt("return", response.map(function (_ref) {
              var data = _ref.data;
              return data.txHash;
            }));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _sendSignedTransactions.apply(this, arguments);
}

function getTransactionsByHashes(_x) {
  return _getTransactionsByHashes.apply(this, arguments);
}

function _getTransactionsByHashes() {
  _getTransactionsByHashes = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(pendingTransactions) {
    var networkConfig, hashes, _yield$axios$get, responseData;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            networkConfig = networkConfigSelector(store.getState());
            hashes = pendingTransactions.map(function (tx) {
              return tx.hash;
            });
            _context.next = 4;
            return axios.get(networkConfig.network.apiAddress + "/transactions", {
              params: {
                hashes: hashes.join(','),
                withScResults: true
              }
            });

          case 4:
            _yield$axios$get = _context.sent;
            responseData = _yield$axios$get.data;
            return _context.abrupt("return", pendingTransactions.map(function (_ref) {
              var hash = _ref.hash,
                  previousStatus = _ref.previousStatus;
              var txOnNetwork = responseData.find(function (txResponse) {
                return (txResponse == null ? void 0 : txResponse.txHash) === hash;
              });
              return {
                hash: hash,
                data: txOnNetwork.data,
                invalidTransaction: txOnNetwork == null,
                status: txOnNetwork.status,
                results: txOnNetwork.results,
                sender: txOnNetwork.sender,
                receiver: txOnNetwork == null ? void 0 : txOnNetwork.receiver,
                pendingResults: txOnNetwork.pendingResults,
                previousStatus: previousStatus,
                hasStatusChanged: status !== previousStatus
              };
            }));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getTransactionsByHashes.apply(this, arguments);
}

function ProviderInitializer() {
  var network = useSelector(networkSelector);
  var walletConnectLogin = useSelector(walletConnectLoginSelector);
  var loginMethod = useSelector(loginMethodSelector);
  var walletLogin = useSelector(walletLoginSelector);
  var address = useSelector(addressSelector);
  var ledgerAccount = useSelector(ledgerAccountSelector);
  var ledgerLogin = useSelector(ledgerLoginSelector);
  var isLoggedIn = useSelector(isLoggedInSelector);

  var _useState = useState(),
      ledgerData = _useState[0],
      setLedgerData = _useState[1];

  var proxy = getProxyProvider();
  var dispatch = useDispatch();

  var _ref = walletConnectLogin ? walletConnectLogin : {
    callbackRoute: '',
    logoutRoute: ''
  },
      callbackRoute = _ref.callbackRoute,
      logoutRoute = _ref.logoutRoute;

  var _useWalletConnectLogi = useWalletConnectLogin({
    callbackRoute: callbackRoute,
    logoutRoute: logoutRoute
  }),
      initWalletLoginProvider = _useWalletConnectLogi[0];

  useEffect(function () {
    refreshChainID();
  }, [network]);
  useEffect(function () {
    initializeProvider();
  }, [loginMethod]);
  useEffect(function () {
    fetchAccount();
  }, [address, isLoggedIn]);
  useEffect(function () {
    // prevent balance double fetching by handling ledgerAccount data separately
    setLedgerAccountInfo();
  }, [ledgerAccount, isLoggedIn, ledgerData]);

  function refreshChainID() {
    getNetworkConfigFromProxyProvider().then(function (networkConfig) {
      if (networkConfig) {
        dispatch(setChainID(networkConfig.ChainID.valueOf()));
      }
    })["catch"](function (e) {
      console.error('To do ', e);
    });
  }

  function setLedgerAccountInfo() {
    if (ledgerAccount == null && ledgerLogin != null && ledgerData) {
      dispatch(setLedgerAccount({
        index: ledgerLogin.index,
        address: address,
        hasContractDataEnabled: ledgerData.dataEnabled,
        version: ledgerData.version
      }));
    }
  }

  function fetchAccount() {
    return _fetchAccount.apply(this, arguments);
  }

  function _fetchAccount() {
    _fetchAccount = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var account;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              dispatch(setIsAccountLoading(true));

              if (!(address && isLoggedIn)) {
                _context.next = 13;
                break;
              }

              _context.prev = 2;
              _context.next = 5;
              return getAccount(address);

            case 5:
              account = _context.sent;

              if (account) {
                dispatch(setAccount({
                  balance: account.balance.toString(),
                  address: address,
                  nonce: account.nonce.valueOf()
                }));
              }

              _context.next = 13;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](2);
              dispatch(setAccountLoadingError('Failed getting account'));
              console.error('Failed getting account ', _context.t0);

            case 13:
              dispatch(setIsAccountLoading(false));

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 9]]);
    }));
    return _fetchAccount.apply(this, arguments);
  }

  function tryAuthenticateWalletUser() {
    return _tryAuthenticateWalletUser.apply(this, arguments);
  }

  function _tryAuthenticateWalletUser() {
    _tryAuthenticateWalletUser = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2() {
      var provider, _address, account;

      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;

              if (!(walletLogin != null)) {
                _context2.next = 14;
                break;
              }

              provider = newWalletProvider(network.walletAddress);
              _context2.next = 5;
              return getAddress();

            case 5:
              _address = _context2.sent;

              if (!_address) {
                _context2.next = 13;
                break;
              }

              setAccountProvider(provider);
              dispatch(loginAction({
                address: _address,
                loginMethod: LoginMethodsEnum.wallet
              }));
              _context2.next = 11;
              return getAccount(_address);

            case 11:
              account = _context2.sent;

              if (account) {
                dispatch(setAccount({
                  balance: account.balance.toString(),
                  address: _address,
                  nonce: getLatestNonce(account)
                }));
              }

            case 13:
              dispatch(setWalletLogin(null));

            case 14:
              _context2.next = 19;
              break;

            case 16:
              _context2.prev = 16;
              _context2.t0 = _context2["catch"](0);
              console.error('Failed authenticating wallet user ', _context2.t0);

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 16]]);
    }));
    return _tryAuthenticateWalletUser.apply(this, arguments);
  }

  function getInitializedHwWalletProvider() {
    return _getInitializedHwWalletProvider.apply(this, arguments);
  }

  function _getInitializedHwWalletProvider() {
    _getInitializedHwWalletProvider = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3() {
      var hwWalletP, isInitialized;
      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              hwWalletP = new HWProvider(proxy);
              isInitialized = hwWalletP.isInitialized();

              if (isInitialized) {
                _context3.next = 6;
                break;
              }

              _context3.next = 5;
              return hwWalletP.init();

            case 5:
              isInitialized = _context3.sent;

            case 6:
              if (!(!isInitialized && isLoggedIn)) {
                _context3.next = 10;
                break;
              }

              console.warn('Could not initialise ledger app');
              logout();
              return _context3.abrupt("return");

            case 10:
              if ((ledgerLogin == null ? void 0 : ledgerLogin.index) != null) {
                hwWalletP.addressIndex = ledgerLogin.index;
              }

              return _context3.abrupt("return", hwWalletP);

            case 12:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _getInitializedHwWalletProvider.apply(this, arguments);
  }

  function setLedgerProvider() {
    return _setLedgerProvider.apply(this, arguments);
  }

  function _setLedgerProvider() {
    _setLedgerProvider = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4() {
      var hwWalletP, ledgerConfig;
      return runtime_1.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return getInitializedHwWalletProvider();

            case 3:
              hwWalletP = _context4.sent;

              if (hwWalletP) {
                _context4.next = 6;
                break;
              }

              return _context4.abrupt("return");

            case 6:
              _context4.next = 8;
              return getLedgerConfiguration(hwWalletP);

            case 8:
              ledgerConfig = _context4.sent;
              setAccountProvider(hwWalletP);
              setLedgerData(ledgerConfig);
              _context4.next = 17;
              break;

            case 13:
              _context4.prev = 13;
              _context4.t0 = _context4["catch"](0);
              console.error('Could not initialise ledger app', _context4.t0);
              logout();

            case 17:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 13]]);
    }));
    return _setLedgerProvider.apply(this, arguments);
  }

  function setExtensionProvider() {
    return _setExtensionProvider.apply(this, arguments);
  }

  function _setExtensionProvider() {
    _setExtensionProvider = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5() {
      var _address2, provider, success;

      return runtime_1.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return getAddress();

            case 3:
              _address2 = _context5.sent;
              provider = ExtensionProvider.getInstance().setAddress(_address2);
              _context5.next = 7;
              return provider.init();

            case 7:
              success = _context5.sent;

              if (success) {
                setAccountProvider(provider);
              } else {
                console.error('Could not initialise extension, make sure Elrond wallet extension is installed.');
              }

              _context5.next = 14;
              break;

            case 11:
              _context5.prev = 11;
              _context5.t0 = _context5["catch"](0);
              console.error('Unable to login to ExtensionProvider', _context5.t0);

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 11]]);
    }));
    return _setExtensionProvider.apply(this, arguments);
  }

  function initializeProvider() {
    if (loginMethod == null) {
      return;
    }

    switch (loginMethod) {
      case LoginMethodsEnum.ledger:
        {
          setLedgerProvider();
          break;
        }

      case LoginMethodsEnum.walletconnect:
        {
          initWalletLoginProvider(false);
          break;
        }

      case LoginMethodsEnum.wallet:
        {
          var provider = newWalletProvider(network.walletAddress);
          setAccountProvider(provider);
          break;
        }

      case LoginMethodsEnum.extension:
        {
          setExtensionProvider();
          break;
        }

      case LoginMethodsEnum.extra:
        {
          setExternalProviderAsAccountProvider();
          break;
        }

      case LoginMethodsEnum.none:
        {
          tryAuthenticateWalletUser();
          break;
        }

      default:
        return;
    }
  }

  return null;
}

var defaultValue = {
  sendSignedTransactionsAsync: sendSignedTransactions,
  getTransactionsByHash: getTransactionsByHashes
};
var OverrideDefaultBehaviourContext = /*#__PURE__*/React__default.createContext(defaultValue);

var TransactionSender = function TransactionSender() {
  var account = useSelector(accountSelector);
  var signedTransactions = useSelector(signedTransactionsSelector);

  var _useContext = useContext(OverrideDefaultBehaviourContext),
      sendSignedTransactionsAsync = _useContext.sendSignedTransactionsAsync;

  var sendingRef = useRef(false);
  var dispatch = useDispatch();

  var clearSignInfo = function clearSignInfo() {
    dispatch(clearAllTransactionsToSign());
    sendingRef.current = false;
  };

  function handleSendTransactions() {
    return _handleSendTransactions.apply(this, arguments);
  }

  function _handleSendTransactions() {
    _handleSendTransactions = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2() {
      var sessionIds, _i, _sessionIds, _signedTransactions$s, _signedTransactions$s2, sessionId, skipSending, _ret;

      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              sessionIds = Object.keys(signedTransactions);
              _i = 0, _sessionIds = sessionIds;

            case 2:
              if (!(_i < _sessionIds.length)) {
                _context2.next = 25;
                break;
              }

              sessionId = _sessionIds[_i];
              skipSending = signedTransactions == null ? void 0 : (_signedTransactions$s = signedTransactions[sessionId]) == null ? void 0 : (_signedTransactions$s2 = _signedTransactions$s.customTransactionInformation) == null ? void 0 : _signedTransactions$s2.signWithoutSending;

              if (!(!sessionId || skipSending)) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt("continue", 22);

            case 7:
              _context2.prev = 7;
              return _context2.delegateYield( /*#__PURE__*/runtime_1.mark(function _callee() {
                var isSessionIdSigned, shouldSendCurrentSession, transactions, transactionsToSend, responseHashes, newStatus, newTransactions, submittedModalPayload;
                return runtime_1.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        isSessionIdSigned = signedTransactions[sessionId].status === TransactionBatchStatusesEnum.signed;
                        shouldSendCurrentSession = isSessionIdSigned && !sendingRef.current;

                        if (shouldSendCurrentSession) {
                          _context.next = 4;
                          break;
                        }

                        return _context.abrupt("return", "continue");

                      case 4:
                        transactions = signedTransactions[sessionId].transactions;

                        if (transactions) {
                          _context.next = 7;
                          break;
                        }

                        return _context.abrupt("return", "continue");

                      case 7:
                        sendingRef.current = true;
                        transactionsToSend = transactions.map(function (tx) {
                          var address = new Address(tx.sender);
                          var transactionObject = newTransaction(tx);
                          var signature = new Signature(tx.signature);
                          transactionObject.applySignature(signature, address);
                          return transactionObject;
                        });
                        _context.next = 11;
                        return sendSignedTransactionsAsync(transactionsToSend);

                      case 11:
                        responseHashes = _context.sent;
                        newStatus = TransactionServerStatusesEnum.pending;
                        newTransactions = transactions.map(function (transaction) {
                          if (responseHashes.includes(transaction.hash)) {
                            return _extends({}, transaction, {
                              status: newStatus
                            });
                          }

                          return transaction;
                        });
                        submittedModalPayload = {
                          sessionId: sessionId,
                          submittedMessage: 'submitted'
                        };
                        dispatch(setTxSubmittedModal(submittedModalPayload));
                        dispatch(updateSignedTransactions({
                          sessionId: sessionId,
                          status: TransactionBatchStatusesEnum.sent,
                          transactions: newTransactions
                        }));
                        clearSignInfo();
                        setNonce(account.nonce + transactions.length);
                        history.pushState({}, document.title, '?');

                      case 20:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })(), "t0", 9);

            case 9:
              _ret = _context2.t0;

              if (!(_ret === "continue")) {
                _context2.next = 12;
                break;
              }

              return _context2.abrupt("continue", 22);

            case 12:
              _context2.next = 19;
              break;

            case 14:
              _context2.prev = 14;
              _context2.t1 = _context2["catch"](7);
              console.error('Unable to send transactions', _context2.t1);
              dispatch(updateSignedTransactions({
                sessionId: sessionId,
                status: TransactionBatchStatusesEnum.fail,
                errorMessage: _context2.t1.message
              }));
              clearSignInfo();

            case 19:
              _context2.prev = 19;
              sendingRef.current = false;
              return _context2.finish(19);

            case 22:
              _i++;
              _context2.next = 2;
              break;

            case 25:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[7, 14, 19, 22]]);
    }));
    return _handleSendTransactions.apply(this, arguments);
  }

  React__default.useEffect(function () {
    handleSendTransactions();
  }, [signedTransactions, account]);
  return null;
};

function TransactionStatusTracker(_ref) {
  var sessionId = _ref.sessionId,
      _ref$transactionPaylo = _ref.transactionPayload,
      transactions = _ref$transactionPaylo.transactions,
      status = _ref$transactionPaylo.status,
      customTransactionInformation = _ref$transactionPaylo.customTransactionInformation;
  var dispatch = useDispatch();
  var intervalRef = useRef(null);
  var isFetchingStatusRef = useRef(false);
  var retriesRef = useRef({});
  var timeoutRefs = useRef([]);

  var _useContext = useContext(OverrideDefaultBehaviourContext),
      getTransactionsByHash = _useContext.getTransactionsByHash;

  var isPending = sessionId != null && getIsTransactionPending(status);

  var manageTimedOutTransactions = function manageTimedOutTransactions() {
    dispatch(updateSignedTransactions({
      sessionId: sessionId,
      status: TransactionBatchStatusesEnum.timedOut
    }));
  };

  var checkTransactionStatus = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var pendingTransactions, serverTransactions, _loop, _iterator, _step, _ret;

      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              if (!(!isPending || transactions == null)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              isFetchingStatusRef.current = true;
              pendingTransactions = transactions.reduce(function (acc, _ref3) {
                var status = _ref3.status,
                    hash = _ref3.hash;

                if (hash != null && !timeoutRefs.current.includes(hash) && getIsTransactionPending(status)) {
                  acc.push({
                    hash: hash,
                    previousStatus: status
                  });
                }

                return acc;
              }, []);

              if (!((pendingTransactions == null ? void 0 : pendingTransactions.length) === 0)) {
                _context.next = 8;
                break;
              }

              isFetchingStatusRef.current = false;
              return _context.abrupt("return");

            case 8:
              _context.next = 10;
              return getTransactionsByHash(pendingTransactions);

            case 10:
              serverTransactions = _context.sent;

              _loop = function _loop() {
                var _step$value = _step.value,
                    hash = _step$value.hash,
                    status = _step$value.status,
                    results = _step$value.results,
                    invalidTransaction = _step$value.invalidTransaction,
                    pendingResults = _step$value.pendingResults,
                    hasStatusChanged = _step$value.hasStatusChanged;

                try {
                  var retriesForThisHash = retriesRef.current[hash];

                  if (retriesForThisHash > 30) {
                    // consider transaction as stuck after 1 minute
                    manageTimedOutTransactions();
                    return {
                      v: void 0
                    };
                  }

                  if (!invalidTransaction) {
                    if (!getIsTransactionPending(status)) {
                      if (!getIsTransactionCompleted(status)) {
                        if (!getIsTransactionFailed(status) && !getIsTransactionTimedOut(status)) {
                          if (!pendingResults) {
                            timeoutRefs.current.push(hash);
                            var transitionToCompletedDelay = (customTransactionInformation == null ? void 0 : customTransactionInformation.completedTransactionsDelay) || 0;
                            setTimeout(function () {
                              dispatch(updateSignedTransactionStatus({
                                sessionId: sessionId,
                                status: TransactionServerStatusesEnum.completed,
                                transactionHash: hash
                              }));
                            }, transitionToCompletedDelay);
                          }
                        }
                      }

                      if (hasStatusChanged) {
                        dispatch(updateSignedTransactionStatus({
                          sessionId: sessionId,
                          status: status,
                          transactionHash: hash
                        }));
                      }

                      refreshAccount();

                      if (getIsTransactionFailed(status)) {
                        var resultWithError = results == null ? void 0 : results.find(function (scResult) {
                          return (scResult == null ? void 0 : scResult.returnMessage) !== '';
                        });
                        dispatch(updateSignedTransactionStatus({
                          transactionHash: hash,
                          sessionId: sessionId,
                          status: TransactionServerStatusesEnum.fail,
                          errorMessage: resultWithError == null ? void 0 : resultWithError.returnMessage
                        }));
                        dispatch(updateSignedTransactions({
                          sessionId: sessionId,
                          status: TransactionBatchStatusesEnum.fail,
                          errorMessage: resultWithError == null ? void 0 : resultWithError.returnMessage
                        }));
                      }
                    } else {
                      retriesRef.current[hash] = retriesRef.current[hash] ? retriesRef.current[hash] + 1 : 1;
                    }
                  } else {
                    retriesRef.current[hash] = retriesRef.current[hash] ? retriesRef.current[hash] + 1 : 1;
                  }
                } catch (error) {
                  console.error(error);
                  manageTimedOutTransactions();
                }
              };

              _iterator = _createForOfIteratorHelperLoose(serverTransactions);

            case 13:
              if ((_step = _iterator()).done) {
                _context.next = 19;
                break;
              }

              _ret = _loop();

              if (!(typeof _ret === "object")) {
                _context.next = 17;
                break;
              }

              return _context.abrupt("return", _ret.v);

            case 17:
              _context.next = 13;
              break;

            case 19:
              _context.next = 24;
              break;

            case 21:
              _context.prev = 21;
              _context.t0 = _context["catch"](0);
              console.error(_context.t0);

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 21]]);
    }));

    return function checkTransactionStatus() {
      return _ref2.apply(this, arguments);
    };
  }();

  useEffect(function () {
    if (isPending) {
      intervalRef.current = setInterval(function () {
        checkTransactionStatus();
      }, 2000);
    } else {
      clearInterval(intervalRef.current);
    }

    return function () {
      clearInterval(intervalRef.current);
    };
  }, [isPending]);
  return null;
}

function TransactionsTracker() {
  var _useGetPendingTransac = useGetPendingTransactions(),
      pendingTransactionsArray = _useGetPendingTransac.pendingTransactionsArray;

  var mappedPendingTransactionsTrackers = pendingTransactionsArray.map(function (_ref) {
    var sessionId = _ref[0],
        transactionPayload = _ref[1];
    return React__default.createElement(TransactionStatusTracker, {
      key: sessionId,
      sessionId: sessionId,
      transactionPayload: transactionPayload
    });
  });
  return React__default.createElement(React__default.Fragment, null, mappedPendingTransactionsTrackers);
}

function getServerConfiguration(_x) {
  return _getServerConfiguration.apply(this, arguments);
}

function _getServerConfiguration() {
  _getServerConfiguration = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(apiAddress) {
    var cleanApiAddress, configUrl, _yield$axios$get, data;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            cleanApiAddress = apiAddress.endsWith('/') ? apiAddress.slice(0, -1) : apiAddress;
            configUrl = cleanApiAddress + "/" + configEndpoint;
            _context.prev = 2;
            _context.next = 5;
            return axios.get(configUrl);

          case 5:
            _yield$axios$get = _context.sent;
            data = _yield$axios$get.data;

            if (!(data != null)) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", data);

          case 9:
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](2);
            console.error('error fetching configuration for ', configUrl);

          case 14:
            return _context.abrupt("return", null);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 11]]);
  }));
  return _getServerConfiguration.apply(this, arguments);
}

function getServerConfigurationForEnvironment(_x) {
  return _getServerConfigurationForEnvironment.apply(this, arguments);
}

function _getServerConfigurationForEnvironment() {
  _getServerConfigurationForEnvironment = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(environment) {
    var fallbackConfig, config;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fallbackConfig = fallbackNetworkConfigurations[environment];
            _context.next = 3;
            return getServerConfiguration(fallbackConfig.apiAddress);

          case 3:
            config = _context.sent;
            return _context.abrupt("return", config !== null ? config : fallbackConfig);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getServerConfigurationForEnvironment.apply(this, arguments);
}

function getScamAddressData(_x) {
  return _getScamAddressData.apply(this, arguments);
}

function _getScamAddressData() {
  _getScamAddressData = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(addressToVerify) {
    var _networkConfigSelecto, _networkConfigSelecto2, apiAddress, apiTimeout, _yield$axios$get, data;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _networkConfigSelecto = networkConfigSelector(store.getState()), _networkConfigSelecto2 = _networkConfigSelecto.network, apiAddress = _networkConfigSelecto2.apiAddress, apiTimeout = _networkConfigSelecto2.apiTimeout;
            _context.next = 3;
            return axios.get("/accounts/" + addressToVerify, {
              baseURL: apiAddress,
              timeout: Number(apiTimeout)
            });

          case 3:
            _yield$axios$get = _context.sent;
            data = _yield$axios$get.data;
            return _context.abrupt("return", data);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getScamAddressData.apply(this, arguments);
}



var index$3 = {
  __proto__: null,
  sendSignedTransactions: sendSignedTransactions,
  getTransactionsByHashes: getTransactionsByHashes,
  getServerConfigurationForEnvironment: getServerConfigurationForEnvironment,
  getServerConfiguration: getServerConfiguration,
  getScamAddressData: getScamAddressData
};

var useGetNetworkConfig = function useGetNetworkConfig() {
  return useSelector(networkConfigSelector);
};

function useGetNotification() {
  var notification = useSelector(notificationModalSelector);
  var dispatch = useDispatch();

  var clearNotification = function clearNotification() {
    return dispatch(clearNotificationModal());
  };

  return {
    notification: notification,
    clearNotification: clearNotification
  };
}

function useGetTransactionDisplayInfo(toastId) {
  return useSelector(function (state) {
    return transactionDisplayInfoSelector(state, toastId);
  });
}

function useParseSignedTransactions() {
  var search = window.location.search;
  var network = useSelector(networkSelector);
  var dispatch = useDispatch();
  React__default.useEffect(function () {
    if (search != null) {
      var searchData = qs.parse(search.replace('?', ''));

      if (searchData && walletSignSession in searchData) {
        var signSessionId = searchData[walletSignSession];
        var signedTransactions = new WalletProvider("" + network.walletAddress + dappInitRoute).getTransactionsFromWalletUrl();

        if (signedTransactions.length > 0) {
          dispatch(moveTransactionsToSignedState({
            sessionId: signSessionId.toString(),
            status: TransactionBatchStatusesEnum.signed,
            transactions: signedTransactions.map(function (tx) {
              return parseTransactionAfterSigning(tx);
            })
          }));
          history.pushState({}, document.title, '?');
        }
      }
    }
  }, [search]);
}

var useSignTransactions = function useSignTransactions() {
  var dispatch = useDispatch();
  var savedCallback = useRef('/');
  var address = useSelector(addressSelector);
  var provider = getAccountProvider();
  var providerType = getProviderType(provider);

  var _useState = useState(null),
      error = _useState[0],
      setError = _useState[1];

  var transactionsToSign = useSelector(transactionsToSignSelector);
  var hasTransactions = Boolean(transactionsToSign == null ? void 0 : transactionsToSign.transactions);
  useParseSignedTransactions();

  var onAbort = function onAbort(sessionId) {
    setError(null);
    clearSignInfo(sessionId);
  };

  function clearSignInfo(sessionId) {
    var _ExtensionProvider$ge;

    var isExtensionProvider = provider instanceof ExtensionProvider;
    dispatch(clearAllTransactionsToSign());
    dispatch(clearTransactionsInfoForSessionId(sessionId));

    if (!isExtensionProvider) {
      return;
    }

    (_ExtensionProvider$ge = ExtensionProvider.getInstance()) == null ? void 0 : _ExtensionProvider$ge.cancelAction == null ? void 0 : _ExtensionProvider$ge.cancelAction();
  }

  var onCancel = function onCancel(errorMessage, sessionId) {
    var isTxCancelled = errorMessage !== TRANSACTION_CANCELLED;
    clearSignInfo(sessionId);
    /*
     * this is triggered by abort action,
     * so no need to show error again
     */

    if (!isTxCancelled) {
      return;
    }

    setError(errorMessage);
  };

  var signWithWallet = function signWithWallet(transactions, sessionId, callbackRoute) {
    var _urlParams;

    if (callbackRoute === void 0) {
      callbackRoute = '';
    }

    var urlParams = (_urlParams = {}, _urlParams[walletSignSession] = sessionId, _urlParams);
    var callbackUrl = "" + window.location.origin + callbackRoute;
    var buildedCallbackUrl = builtCallbackUrl({
      callbackUrl: callbackUrl,
      urlParams: urlParams
    });
    provider.signTransactions(transactions, {
      callbackUrl: encodeURIComponent(buildedCallbackUrl)
    });
  };

  var signTransactionsWithProvider = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var sessionId, transactions, callbackRoute, customTransactionInformation, redirectAfterSign, redirectRoute, isCurrentRoute, shouldRedirectAfterSign, isProviderInitialized, errorMessage, signedTransactions, hasSameTransactions, hasAllTransactionsSigned, shouldMoveTransactionsToSignedState, signedTransactionsArray, _errorMessage;

      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              sessionId = transactionsToSign.sessionId, transactions = transactionsToSign.transactions, callbackRoute = transactionsToSign.callbackRoute, customTransactionInformation = transactionsToSign.customTransactionInformation;
              redirectAfterSign = customTransactionInformation.redirectAfterSign;
              redirectRoute = callbackRoute || window.location.pathname;
              isCurrentRoute = window.location.pathname.includes(redirectRoute);
              shouldRedirectAfterSign = redirectAfterSign && !isCurrentRoute;
              _context.prev = 5;
              _context.next = 8;
              return provider.init();

            case 8:
              isProviderInitialized = _context.sent;

              if (isProviderInitialized) {
                _context.next = 11;
                break;
              }

              return _context.abrupt("return");

            case 11:
              _context.next = 19;
              break;

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](5);
              errorMessage = (_context.t0 == null ? void 0 : _context.t0.message) || _context.t0 || PROVIDER_NOT_INTIALIZED;
              console.error(PROVIDER_NOT_INTIALIZED, errorMessage);
              onCancel(errorMessage);
              return _context.abrupt("return");

            case 19:
              _context.prev = 19;
              _context.next = 22;
              return provider.signTransactions(transactions);

            case 22:
              signedTransactions = _context.sent;
              hasSameTransactions = Object.keys(signedTransactions).length === transactions.length;
              hasAllTransactionsSigned = signedTransactions && hasSameTransactions;
              shouldMoveTransactionsToSignedState = signedTransactions && hasAllTransactionsSigned;

              if (shouldMoveTransactionsToSignedState) {
                _context.next = 28;
                break;
              }

              return _context.abrupt("return");

            case 28:
              signedTransactionsArray = Object.values(signedTransactions).map(function (tx) {
                return parseTransactionAfterSigning(tx);
              });
              dispatch(moveTransactionsToSignedState({
                sessionId: sessionId,
                transactions: signedTransactionsArray,
                status: TransactionBatchStatusesEnum.signed
              }));

              if (shouldRedirectAfterSign) {
                window.location.href = redirectRoute;
              }

              _context.next = 38;
              break;

            case 33:
              _context.prev = 33;
              _context.t1 = _context["catch"](19);
              _errorMessage = (error == null ? void 0 : error.message) || error || ERROR_SIGNING_TX;
              console.error(ERROR_SIGNING_TX, _errorMessage);
              onCancel(_errorMessage, sessionId);

            case 38:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[5, 13], [19, 33]]);
    }));

    return function signTransactionsWithProvider() {
      return _ref.apply(this, arguments);
    };
  }();

  var signTransactions = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2() {
      var sessionId, transactions, callbackRoute, setTransactionNonces, proxyAccount, isSigningWithWebWallet, isSigningWithProvider, latestNonce, mappedTransactions, defaultErrorMessage, errorMessage;
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (transactionsToSign) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return");

            case 2:
              sessionId = transactionsToSign.sessionId, transactions = transactionsToSign.transactions, callbackRoute = transactionsToSign.callbackRoute;

              if (provider) {
                _context2.next = 6;
                break;
              }

              console.error(MISSING_PROVIDER_MESSAGE);
              return _context2.abrupt("return");

            case 6:
              /*
               * if the transaction is cancelled
               * the callback will go to undefined,
               * we save the most recent one for a valid transaction
               */
              savedCallback.current = callbackRoute || window.location.pathname;

              setTransactionNonces = function setTransactionNonces(latestNonce, transactions) {
                return transactions.map(function (tx, index) {
                  tx.setNonce(new Nonce(latestNonce + index));
                  return tx;
                });
              };

              _context2.prev = 8;
              _context2.next = 11;
              return getAccountFromProxyProvider(address);

            case 11:
              proxyAccount = _context2.sent;

              if (!(proxyAccount == null)) {
                _context2.next = 14;
                break;
              }

              return _context2.abrupt("return");

            case 14:
              isSigningWithWebWallet = providerType === LoginMethodsEnum.wallet;
              isSigningWithProvider = ![LoginMethodsEnum.wallet, LoginMethodsEnum.ledger].includes(providerType);
              latestNonce = getLatestNonce(proxyAccount);
              mappedTransactions = setTransactionNonces(latestNonce, transactions);

              if (isSigningWithWebWallet) {
                signWithWallet(mappedTransactions, sessionId, callbackRoute);
              }

              if (isSigningWithProvider) {
                signTransactionsWithProvider();
              }

              _context2.next = 29;
              break;

            case 22:
              _context2.prev = 22;
              _context2.t0 = _context2["catch"](8);
              defaultErrorMessage = error == null ? void 0 : error.message;
              errorMessage = defaultErrorMessage || ERROR_SIGNING;
              onCancel(errorMessage, sessionId);
              dispatch(moveTransactionsToSignedState({
                sessionId: sessionId,
                status: TransactionBatchStatusesEnum.cancelled
              }));
              console.error(errorMessage, _context2.t0);

            case 29:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[8, 22]]);
    }));

    return function signTransactions() {
      return _ref2.apply(this, arguments);
    };
  }();

  useEffect(function () {
    signTransactions();
  }, [transactionsToSign]);
  return {
    error: error,
    onAbort: onAbort,
    hasTransactions: hasTransactions,
    callbackRoute: savedCallback.current,
    sessionId: transactionsToSign == null ? void 0 : transactionsToSign.sessionId,
    transactions: transactionsToSign == null ? void 0 : transactionsToSign.transactions
  };
};

function useGetSignedTransactions() {
  var signedTransactions = useSelector(signedTransactionsSelector);
  var signedTransactionsArray = Object.entries(signedTransactions);
  var hasSignedTransactions = (signedTransactionsArray == null ? void 0 : signedTransactionsArray.length) > 0;
  return {
    signedTransactions: signedTransactions,
    signedTransactionsArray: signedTransactionsArray,
    hasSignedTransactions: hasSignedTransactions
  };
}

var swr = {};

try {
  swr = /*#__PURE__*/require('swr')["default"];
} catch (err) {}

var useSwr = swr;

var fetcher = function fetcher(url) {
  return axios.get(url).then(function (response) {
    return response.data;
  });
};

function useGetTokenDetails(_ref) {
  var _selectedToken$assets;

  var tokenId = _ref.tokenId;

  var _useGetNetworkConfig = useGetNetworkConfig(),
      network = _useGetNetworkConfig.network;

  var _getIdentifierType = getIdentifierType(tokenId),
      isEsdt = _getIdentifierType.isEsdt;

  var tokenEndpoint = isEsdt ? 'tokens' : 'nfts';

  var _useSwr = useSwr(Boolean(tokenId) ? network.apiAddress + "/" + tokenEndpoint + "/" + tokenId : null, fetcher),
      selectedToken = _useSwr.data,
      error = _useSwr.error;

  if (!tokenId) {
    return {
      tokenDenomination: Number(network.egldDenomination),
      tokenLabel: '',
      tokenAvatar: ''
    };
  }

  var tokenDenomination = selectedToken ? selectedToken == null ? void 0 : selectedToken.decimals : Number(network.egldDenomination);
  var tokenLabel = selectedToken ? selectedToken == null ? void 0 : selectedToken.name : '';
  var tokenAvatar = selectedToken ? "" + (selectedToken == null ? void 0 : (_selectedToken$assets = selectedToken.assets) == null ? void 0 : _selectedToken$assets.svgUrl) : '';
  return {
    tokenDenomination: tokenDenomination,
    tokenLabel: tokenLabel,
    tokenAvatar: tokenAvatar,
    error: error
  };
}

var useGetAccountInfo = function useGetAccountInfo() {
  return useSelector(accountInfoSelector);
};

var useGetLoginInfo = function useGetLoginInfo() {
  var loginInfo = useSelector(loginInfoSelector);
  var isLoggedIn = useSelector(isLoggedInSelector);
  return _extends({}, loginInfo, {
    isLoggedIn: isLoggedIn
  });
};

var useGetAccountProvider = function useGetAccountProvider() {
  var provider = getAccountProvider();
  var providerType = getProviderType(provider);
  return {
    provider: provider,
    providerType: providerType
  };
};

var verifiedAddresses = {};
function useSignTransactionsWithLedger(_ref) {
  var _currentTransaction$t, _currentTransaction$t2, _currentTransaction$t3;

  var onCancel = _ref.onCancel,
      _ref$verifyReceiverSc = _ref.verifyReceiverScam,
      verifyReceiverScam = _ref$verifyReceiverSc === void 0 ? true : _ref$verifyReceiverSc;
  var transactionsToSign = useSelector(transactionsToSignSelector);

  var _useGetAccountInfo = useGetAccountInfo(),
      address = _useGetAccountInfo.account.address;

  var _ref2 = transactionsToSign || {},
      sessionId = _ref2.sessionId,
      transactions = _ref2.transactions,
      callbackRoute = _ref2.callbackRoute,
      customTransactionInformation = _ref2.customTransactionInformation;

  var _useState = useState(0),
      currentStep = _useState[0],
      setCurrentStep = _useState[1];

  var _useState2 = useState(),
      signedTransactions = _useState2[0],
      setSignedTransactions = _useState2[1];

  var _useParseMultiEsdtTra = useParseMultiEsdtTransferData({
    transactions: transactions
  }),
      getTxInfoByDataField = _useParseMultiEsdtTra.getTxInfoByDataField,
      allTransactions = _useParseMultiEsdtTra.allTransactions;

  var _useState3 = useState(null),
      currentTransaction = _useState3[0],
      setCurrentTransaction = _useState3[1];

  var provider = getAccountProvider();
  var egldLabel = useSelector(egldLabelSelector);

  var _useState4 = useState(false),
      waitingForDevice = _useState4[0],
      setWaitingForDevice = _useState4[1];

  var dispatch = useDispatch();
  var isLastTransaction = currentStep === allTransactions.length - 1;
  useEffect(function () {
    extractTransactionsInfo();
  }, [currentStep, allTransactions]);

  function extractTransactionsInfo() {
    return _extractTransactionsInfo.apply(this, arguments);
  }

  function _extractTransactionsInfo() {
    _extractTransactionsInfo = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var _verifiedAddresses$re;

      var tx, transaction, multiTxData, dataField, transactionTokenInfo, tokenId, receiver, notSender, verified, _ref3, data, isTokenTransaction;

      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              tx = allTransactions[currentStep];

              if (!(tx == null)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              transaction = tx.transaction, multiTxData = tx.multiTxData;
              dataField = transaction.getData().toString();
              transactionTokenInfo = getTxInfoByDataField(transaction.getData().toString(), multiTxData);
              tokenId = transactionTokenInfo.tokenId;
              receiver = transaction.getReceiver().toString();
              notSender = address !== receiver;
              verified = receiver in verifiedAddresses;

              if (!(notSender && !verified && verifyReceiverScam)) {
                _context.next = 15;
                break;
              }

              _context.next = 13;
              return getScamAddressData(receiver);

            case 13:
              data = _context.sent;
              verifiedAddresses = _extends({}, verifiedAddresses, data.scamInfo ? (_ref3 = {}, _ref3[receiver] = data.scamInfo, _ref3) : {});

            case 15:
              isTokenTransaction = Boolean(tokenId && isTokenTransfer({
                tokenId: tokenId,
                erdLabel: egldLabel
              }));
              setCurrentTransaction({
                transaction: transaction,
                receiverScamInfo: ((_verifiedAddresses$re = verifiedAddresses[receiver]) == null ? void 0 : _verifiedAddresses$re.info) || null,
                transactionTokenInfo: transactionTokenInfo,
                isTokenTransaction: isTokenTransaction,
                dataField: dataField
              });

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _extractTransactionsInfo.apply(this, arguments);
  }

  function reset() {
    setCurrentStep(0);
    setSignedTransactions(undefined);
    setWaitingForDevice(false);
  }

  function sign() {
    return _sign.apply(this, arguments);
  }

  function _sign() {
    _sign = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2() {
      var _newSignedTx, trueForLedger, signedTx, newSignedTx, newSignedTransactions, message, statusCode, errMessage;

      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;

              if (!(currentTransaction == null || sessionId == null)) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt("return");

            case 3:
              trueForLedger = getIsProviderEqualTo(LoginMethodsEnum.ledger);
              setWaitingForDevice(trueForLedger);
              _context2.next = 7;
              return provider.signTransaction(currentTransaction.transaction);

            case 7:
              signedTx = _context2.sent;
              newSignedTx = (_newSignedTx = {}, _newSignedTx[currentStep] = signedTx, _newSignedTx);
              newSignedTransactions = signedTransactions ? _extends({}, signedTransactions, newSignedTx) : newSignedTx;
              setSignedTransactions(newSignedTransactions);

              if (!isLastTransaction) {
                setCurrentStep(function (exising) {
                  return exising + 1;
                });
                setWaitingForDevice(false);
              } else if (newSignedTransactions) {
                dispatch(moveTransactionsToSignedState({
                  sessionId: sessionId,
                  status: TransactionBatchStatusesEnum.signed,
                  transactions: Object.values(newSignedTransactions).map(function (tx) {
                    return parseTransactionAfterSigning(tx, trueForLedger);
                  })
                }));
                reset();

                if (callbackRoute != null && customTransactionInformation != null && customTransactionInformation.redirectAfterSign && !window.location.pathname.includes(callbackRoute)) {
                  window.location.href = callbackRoute;
                }
              }

              _context2.next = 21;
              break;

            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](0);
              console.error(_context2.t0, 'sign error');
              message = _context2.t0.message, statusCode = _context2.t0.statusCode;
              errMessage = statusCode in ledgerErrorCodes ? ledgerErrorCodes[statusCode].message : message;
              reset();
              dispatch(setSignTransactionsError(errMessage));

            case 21:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 14]]);
    }));
    return _sign.apply(this, arguments);
  }

  function signTx() {
    try {
      if (currentTransaction == null) {
        return;
      }

      var signature = currentTransaction.transaction.getSignature();

      if (signature) {
        if (!isLastTransaction) {
          setCurrentStep(function (exising) {
            return exising + 1;
          });
        }
      } else {
        // currently code doesn't reach here because getSignature throws error if none is found
        sign();
      }
    } catch (_unused) {
      // the only way to check if tx has signature is with try catch
      sign();
    }
  }

  var isFirst = currentStep === 0;

  function onAbort() {
    if (isFirst) {
      dispatch(clearAllTransactionsToSign());
      onCancel();

      if (callbackRoute != null && customTransactionInformation != null && customTransactionInformation.redirectAfterSign) {
        window.location.href = callbackRoute;
      }
    } else {
      setCurrentStep(function (existing) {
        return existing - 1;
      });
    }
  }

  var continueWithoutSigning = (currentTransaction == null ? void 0 : (_currentTransaction$t = currentTransaction.transactionTokenInfo) == null ? void 0 : _currentTransaction$t.type) && (currentTransaction == null ? void 0 : (_currentTransaction$t2 = currentTransaction.transactionTokenInfo) == null ? void 0 : _currentTransaction$t2.multiTxData) && !(currentTransaction != null && currentTransaction.dataField.endsWith(currentTransaction == null ? void 0 : (_currentTransaction$t3 = currentTransaction.transactionTokenInfo) == null ? void 0 : _currentTransaction$t3.multiTxData));

  function onSignTransaction() {
    if (continueWithoutSigning) {
      setCurrentStep(function (exising) {
        return exising + 1;
      });
    } else {
      signTx();
    }
  }

  function onNext() {
    setCurrentStep(function (current) {
      var nextStep = current + 1;

      if (nextStep > (allTransactions == null ? void 0 : allTransactions.length)) {
        return current;
      }

      return nextStep;
    });
  }

  function onPrev() {
    setCurrentStep(function (current) {
      var nextStep = current - 1;

      if (nextStep < 0) {
        return current;
      }

      return nextStep;
    });
  }

  return {
    allTransactions: allTransactions,
    onSignTransaction: onSignTransaction,
    onNext: onNext,
    onPrev: onPrev,
    waitingForDevice: waitingForDevice,
    onAbort: onAbort,
    isLastTransaction: isLastTransaction,
    callbackRoute: callbackRoute,
    currentStep: currentStep,
    signedTransactions: signedTransactions,
    currentTransaction: currentTransaction
  };
}

var useGetSignTransactionsError = function useGetSignTransactionsError() {
  return useSelector(signTransactionsErrorSelector);
};

var getTimeout = function getTimeout(minutes) {
  return 1000 * 60 * minutes;
};

var debounce = 500;
var useIdleTimer = function useIdleTimer(_ref) {
  var _ref$minutes = _ref.minutes,
      minutes = _ref$minutes === void 0 ? 10 : _ref$minutes,
      onLogout = _ref.onLogout;
  var isLoggedIn = getIsLoggedIn();
  var logout$1 = onLogout || logout;
  var timeout = getTimeout(minutes);

  var onIdle = function onIdle() {
    if (isLoggedIn) {
      logout$1();
    }
  };

  useIdleTimer$1({
    timeout: timeout,
    onIdle: onIdle,
    debounce: debounce
  });
};

function getAccountShard() {
  return _getAccountShard.apply(this, arguments);
}

function _getAccountShard() {
  _getAccountShard = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
    var appState, apiAddress, address, shard, _yield$axios$get, account;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            appState = store.getState();
            apiAddress = apiNetworkSelector(appState);
            address = addressSelector(appState);
            shard = shardSelector(appState);
            _context.prev = 4;

            if (!(shard == null && address)) {
              _context.next = 14;
              break;
            }

            _context.next = 8;
            return axios.get(apiAddress + "/accounts/" + address);

          case 8:
            _yield$axios$get = _context.sent;
            account = _yield$axios$get.data;
            store.dispatch(setAccountShard(account.shard));
            return _context.abrupt("return", account.shard);

          case 14:
            return _context.abrupt("return", shard);

          case 15:
            _context.next = 21;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](4);
            console.error(_context.t0);
            return _context.abrupt("return", null);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 17]]);
  }));
  return _getAccountShard.apply(this, arguments);
}

function AppInitializer(_ref) {
  var _ref$customNetworkCon = _ref.customNetworkConfig,
      customNetworkConfig = _ref$customNetworkCon === void 0 ? {} : _ref$customNetworkCon,
      children = _ref.children,
      environment = _ref.environment;

  var _useState = useState(false),
      initialized = _useState[0],
      setInitialized = _useState[1];

  var account = useGetAccountInfo();
  var address = account.address,
      publicKey = account.publicKey;
  var dispatch = useDispatch();

  function initializeProviders(networkConfig) {
    initializeProxyProvider(networkConfig);
  }

  function initializeNetwork() {
    return _initializeNetwork.apply(this, arguments);
  }

  function _initializeNetwork() {
    _initializeNetwork = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var fetchConfigFromServer, customNetworkApiAddress, fallbackConfig, localConfig, fallbackApiAddress, serverConfig, apiConfig;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              fetchConfigFromServer = !(customNetworkConfig != null && customNetworkConfig.skipFetchFromServer);
              customNetworkApiAddress = customNetworkConfig == null ? void 0 : customNetworkConfig.apiAddress;
              fallbackConfig = fallbackNetworkConfigurations[environment] || {};
              localConfig = _extends({}, fallbackConfig, customNetworkConfig);

              if (!fetchConfigFromServer) {
                _context.next = 14;
                break;
              }

              fallbackApiAddress = fallbackConfig == null ? void 0 : fallbackConfig.apiAddress;
              _context.next = 8;
              return getServerConfiguration(customNetworkApiAddress || fallbackApiAddress);

            case 8:
              serverConfig = _context.sent;

              if (!(serverConfig != null)) {
                _context.next = 14;
                break;
              }

              apiConfig = _extends({}, fallbackConfig, serverConfig, customNetworkConfig);
              dispatch(initializeNetworkConfig(apiConfig));
              initializeProviders(apiConfig);
              return _context.abrupt("return");

            case 14:
              dispatch(initializeNetworkConfig(localConfig));
              initializeProviders(localConfig);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _initializeNetwork.apply(this, arguments);
  }

  function initializeApp() {
    return _initializeApp.apply(this, arguments);
  }

  function _initializeApp() {
    _initializeApp = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2() {
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return initializeNetwork();

            case 2:
              setInitialized(true);
              getAccountShard();

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _initializeApp.apply(this, arguments);
  }

  useEffect(function () {
    if (!address) {
      return;
    }

    getAccountShard();
  }, [address]);
  useEffect(function () {
    if (address) {
      var pubKey = new Address$1(address).hex();

      if (pubKey !== publicKey) {
        logout();
      }
    }
  }, [address, publicKey]);
  useEffect(function () {
    initializeApp();
  }, [customNetworkConfig, environment]);
  return initialized ? React__default.createElement(React__default.Fragment, null, children) : null;
}

var DappProvider = function DappProvider(_ref) {
  var children = _ref.children,
      _ref$customNetworkCon = _ref.customNetworkConfig,
      customNetworkConfig = _ref$customNetworkCon === void 0 ? {} : _ref$customNetworkCon,
      externalProvider = _ref.externalProvider,
      environment = _ref.environment,
      _ref$sendSignedTransa = _ref.sendSignedTransactionsAsync,
      sendSignedTransactionsAsync = _ref$sendSignedTransa === void 0 ? sendSignedTransactions : _ref$sendSignedTransa,
      _ref$getTransactionsB = _ref.getTransactionsByHash,
      getTransactionsByHash = _ref$getTransactionsB === void 0 ? getTransactionsByHashes : _ref$getTransactionsB;
  var memoizedSendSignedTransactionsAsync = useCallback(sendSignedTransactionsAsync, []);

  if (!environment) {
    //throw if the user tries to initialize the app without a valid environment
    throw new Error('missing environment flag');
  }

  if (externalProvider != null) {
    setExternalProvider(externalProvider);
  }

  var memoizedGetTransactionsByHash = useCallback(getTransactionsByHash, []);
  return React__default.createElement(Provider, {
    context: DappCoreContext,
    store: store
  }, React__default.createElement(PersistGate, {
    persistor: persistor,
    loading: null
  }, React__default.createElement(OverrideDefaultBehaviourContext.Provider, {
    value: {
      sendSignedTransactionsAsync: memoizedSendSignedTransactionsAsync,
      getTransactionsByHash: memoizedGetTransactionsByHash
    }
  }, React__default.createElement(AppInitializer, {
    environment: environment,
    customNetworkConfig: customNetworkConfig
  }, React__default.createElement(ProviderInitializer, null), React__default.createElement(TransactionSender, null), React__default.createElement(TransactionsTracker, null), children))));
};

var AuthenticatedRoutesWrapper = function AuthenticatedRoutesWrapper(_ref) {
  var children = _ref.children,
      routes = _ref.routes,
      unlockRoute = _ref.unlockRoute,
      onRedirect = _ref.onRedirect;
  var isLoggedIn = useSelector(isLoggedInSelector);
  var isAccountLoading = useSelector(isAccountLoadingSelector);
  var walletLogin = useSelector(walletLoginSelector);
  var pathname = window.location.pathname;
  var authenticatedRoutesRef = useRef(routes.filter(function (route) {
    return Boolean(route.authenticatedRoute);
  }));
  var isOnAuthenticatedRoute = authenticatedRoutesRef.current.some(function (_ref2) {
    var path = _ref2.path;
    return pathname === path;
  });
  var shouldRedirect = isOnAuthenticatedRoute && !isLoggedIn && walletLogin == null;

  if (isAccountLoading || walletLogin) {
    return null;
  }

  if (shouldRedirect) {
    if (onRedirect) {
      onRedirect(unlockRoute);
    } else {
      window.location.href = unlockRoute;
    }

    return null;
  }

  return React__default.createElement(React__default.Fragment, null, children);
};

var TransactionParameter = function TransactionParameter(sender, receiver, functionName, inputParameters, outputParameters) {
  this.sender = sender;
  this.receiver = receiver;
  this.functionName = functionName;
  this.inputParameters = inputParameters;
  this.outputParameters = outputParameters;
};



var index$4 = {
  __proto__: null,
  TransactionParameter: TransactionParameter,
  newTransaction: newTransaction
};

var withClassNameWrapper = function withClassNameWrapper(Component) {
  return function (_ref) {
    var props = _extends({}, _ref);

    return React__default.createElement("span", {
      className: wrapperClassName
    }, React__default.createElement(Component, Object.assign({}, props)));
  };
};

var denominateInvalid = function denominateInvalid(props) {
  return React__default.createElement("span", {
    "data-testid": props['data-testid'] ? props['data-testid'] : 'denominateComponent'
  }, React__default.createElement("span", {
    className: 'int-amount'
  }, "..."));
};

var denominateValid = function denominateValid(props, erdLabel) {
  var value = props.value,
      _props$showLastNonZer = props.showLastNonZeroDecimal,
      showLastNonZeroDecimal = _props$showLastNonZer === void 0 ? false : _props$showLastNonZer,
      _props$showLabel = props.showLabel,
      showLabel = _props$showLabel === void 0 ? true : _props$showLabel;
  var decimals$1 = props.decimals !== undefined ? props.decimals : decimals;
  var denomination$1 = props.denomination !== undefined ? props.denomination : denomination;
  var denominatedValue = denominate({
    input: value,
    denomination: denomination$1,
    decimals: decimals$1,
    showLastNonZeroDecimal: showLastNonZeroDecimal,
    addCommas: true
  });
  var valueParts = denominatedValue.split('.');
  var hasNoDecimals = valueParts.length === 1;
  var isNotZero = denominatedValue !== '0';

  if (decimals$1 > 0 && hasNoDecimals && isNotZero) {
    var zeros = '';

    for (var i = 1; i <= decimals$1; i++) {
      zeros = zeros + '0';
    }

    valueParts.push(zeros);
  }

  return React__default.createElement("span", {
    "data-testid": props['data-testid'] ? props['data-testid'] : 'denominateComponent'
  }, React__default.createElement("span", {
    className: 'int-amount'
  }, valueParts[0]), valueParts.length > 1 && React__default.createElement("span", {
    className: 'decimals'
  }, ".", valueParts[1]), showLabel && React__default.createElement("span", {
    className: "symbol " + (props.token ? 'text-muted' : '')
  }, "\xA0", props.token ? props.token : erdLabel));
};

var Denominate = function Denominate(props) {
  var value = props.value;
  return !stringIsInteger(value) ? denominateInvalid(props) : denominateValid(props, props.egldLabel || '');
};

var DenominateWrapper = function DenominateWrapper(props) {
  var egldLabel = props.egldLabel || getEgldLabel();

  var denominateProps = _extends({}, props, {
    egldLabel: egldLabel
  });

  return React__default.createElement(Denominate, Object.assign({}, denominateProps));
};

var Denominate$1 = /*#__PURE__*/withClassNameWrapper(DenominateWrapper);

var fontawesomeFreeSolidIcons = {};

try {
  fontawesomeFreeSolidIcons = /*#__PURE__*/require('@fortawesome/free-solid-svg-icons');
} catch (err) {}

var icons = fontawesomeFreeSolidIcons;

var ReactFontawesome = {};

try {
  ReactFontawesome = /*#__PURE__*/require('@fortawesome/react-fontawesome');
} catch (err) {}

var ReactFontawesome$1 = ReactFontawesome;

var ExplorerLink = function ExplorerLink(_ref) {
  var page = _ref.page,
      text = _ref.text,
      className = _ref.className;

  var _useGetNetworkConfig = useGetNetworkConfig(),
      explorerAddress = _useGetNetworkConfig.network.explorerAddress;

  return React__default.createElement("a", Object.assign({
    href: "" + explorerAddress + page
  }, {
    target: '_blank'
  }, {
    className: "link-style " + className
  }), text ? React__default.createElement(React__default.Fragment, null, text) : React__default.createElement(ReactFontawesome$1.FontAwesomeIcon, {
    icon: icons.faSearch,
    className: 'text-secondary'
  }));
};

var ExplorerLink$1 = /*#__PURE__*/withClassNameWrapper(ExplorerLink);

var ExtensionLoginButton = function ExtensionLoginButton(_ref) {
  var token = _ref.token,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'extension-login' : _ref$className,
      children = _ref.children,
      callbackRoute = _ref.callbackRoute,
      buttonClassName = _ref.buttonClassName,
      _ref$loginButtonText = _ref.loginButtonText,
      loginButtonText = _ref$loginButtonText === void 0 ? 'Maiar DeFi Wallet' : _ref$loginButtonText,
      _ref$redirectAfterLog = _ref.redirectAfterLogin,
      redirectAfterLogin = _ref$redirectAfterLog === void 0 ? false : _ref$redirectAfterLog,
      _ref$shouldRenderDefa = _ref.shouldRenderDefaultCss,
      shouldRenderDefaultCss = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa;

  var _useExtensionLogin = useExtensionLogin({
    callbackRoute: callbackRoute,
    token: token,
    redirectAfterLogin: redirectAfterLogin
  }),
      onInitiateLogin = _useExtensionLogin[0];

  var isFirefox = navigator.userAgent.indexOf('Firefox') != -1;
  var classes = getGeneratedClasses(className, shouldRenderDefaultCss, {
    wrapper: "btn btn-primary px-sm-4 m-1 mx-sm-3 " + (buttonClassName != null ? buttonClassName : ''),
    loginText: 'text-left',
    noExtensionButtonWrapper: 'btn btn-unlock d-inline-block',
    noExtensionButtonContent: 'd-flex justify-content-between align-items-center',
    noExtensionButtonTitle: 'title',
    noExtensionButtonIcon: ''
  });

  var handleLogin = function handleLogin() {
    onInitiateLogin();
  };

  return !window.elrondWallet ? React__default.createElement("a", {
    rel: 'noreferrer',
    href: isFirefox ? 'https://addons.mozilla.org/en-US/firefox/addon/maiar-defi-wallet/' : 'https://chrome.google.com/webstore/detail/dngmlblcodfobpdpecaadgfbcggfjfnm?authuser=0&hl=en',
    target: '_blank',
    className: classes.noExtensionButtonWrapper
  }, children || React__default.createElement("div", {
    className: classes.noExtensionButtonContent
  }, React__default.createElement("div", {
    className: classes.noExtensionButtonTitle
  }, "Maiar DeFi Wallet"), React__default.createElement(ReactFontawesome$1.FontAwesomeIcon, {
    className: classes.noExtensionButtonIcon,
    icon: icons.faArrowRight
  }))) : React__default.createElement("button", {
    onClick: handleLogin,
    className: classes.wrapper
  }, children || React__default.createElement("span", {
    className: classes.loginText
  }, loginButtonText));
};

var ExtensionLoginButton$1 = /*#__PURE__*/withClassNameWrapper(ExtensionLoginButton);

var ReactBootstrap = {};

try {
  ReactBootstrap = /*#__PURE__*/require('react-bootstrap');
} catch (err) {}

var ReactBootstrap$1 = ReactBootstrap;

var ModalContainer = function ModalContainer(_ref) {
  var children = _ref.children,
      noSpacer = _ref.noSpacer,
      className = _ref.className,
      title = _ref.title,
      onClose = _ref.onClose;
  return React__default.createElement(ReactBootstrap$1.Modal, {
    show: true,
    backdrop: 'static',
    onHide: onClose,
    className: "modal-container " + (className ? className : '') + " " + wrapperClassName,
    animation: false,
    centered: true
  }, React__default.createElement("div", {
    className: 'modal-card card w-100'
  }, React__default.createElement("div", {
    className: 'card-title h5 mb-0'
  }, React__default.createElement("div", {
    className: 'd-flex justify-content-between align-items-center pt-spacer px-spacer mb-0'
  }, React__default.createElement("div", {
    className: 'px-3'
  }, title), React__default.createElement("button", {
    type: 'button',
    className: 'btn btn-light px-3 py-2',
    onClick: onClose
  }, React__default.createElement(ReactFontawesome$1.FontAwesomeIcon, {
    size: 'lg',
    icon: icons.faTimes
  })))), React__default.createElement("div", {
    className: "modal-card-body text-center " + (noSpacer ? 'p-0' : 'p-spacer')
  }, children)));
};

var PageState = function PageState(_ref) {
  var _classNames;

  var icon = _ref.icon,
      title = _ref.title,
      action = _ref.action,
      iconClass = _ref.iconClass,
      dataTestId = _ref.dataTestId,
      description = _ref.description,
      iconBgClass = _ref.iconBgClass,
      _ref$iconSize = _ref.iconSize,
      iconSize = _ref$iconSize === void 0 ? '5x' : _ref$iconSize,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'page-state' : _ref$className,
      _ref$shouldRenderDefa = _ref.shouldRenderDefaultCss,
      shouldRenderDefaultCss = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa;
  var generatedClasses = getGeneratedClasses(className, shouldRenderDefaultCss, {
    wrapper: 'state m-auto p-4 text-center',
    iconContainer: classNames('icon-state mx-auto', (_classNames = {}, _classNames["" + iconBgClass] = Boolean(iconBgClass), _classNames)),
    iconClass: classNames(iconClass != null && iconClass),
    title: 'h4 my-4',
    description: 'mb-3'
  });
  return React__default.createElement("div", {
    className: generatedClasses.wrapper,
    "data-testid": dataTestId
  }, icon && React__default.createElement("span", {
    className: generatedClasses.iconContainer
  }, React__default.createElement(ReactFontawesome$1.FontAwesomeIcon, {
    icon: icon,
    className: generatedClasses.iconClass,
    size: iconSize
  })), title && React__default.createElement("p", {
    className: generatedClasses.title
  }, title), description && React__default.createElement("div", {
    className: generatedClasses.description
  }, description), action && React__default.createElement(React__default.Fragment, null, action));
};
var PageState$1 = /*#__PURE__*/withClassNameWrapper(PageState);

var trimHash = function trimHash(hash, keep) {
  if (keep === void 0) {
    keep = 10;
  }

  var start = hash.substring(0, keep);
  var end = hash.substring(hash.length - keep);
  return start + "..." + end;
};

var noBalance = '...';

var AddressRow = function AddressRow(_ref) {
  var address = _ref.address,
      index = _ref.index,
      selectedAddress = _ref.selectedAddress,
      onSelectAddress = _ref.onSelectAddress;

  var _React$useState = React__default.useState(noBalance),
      balance = _React$useState[0],
      setBalance = _React$useState[1];

  var handleChange = function handleChange(e) {
    var checked = e.target.checked;

    if (checked) {
      onSelectAddress({
        address: address,
        index: index
      });
    }
  };

  var fetchBalance = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var _balance;

      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return getAccountBalance(address);

            case 3:
              _balance = _context.sent;
              setBalance(_balance);
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              console.error('error fetching balance', _context.t0, balance);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 7]]);
    }));

    return function fetchBalance() {
      return _ref2.apply(this, arguments);
    };
  }();

  React__default.useEffect(function () {
    fetchBalance();
  }, []);
  return React__default.createElement("tr", null, React__default.createElement("td", {
    className: 'text-left'
  }, React__default.createElement("div", {
    className: 'd-flex align-items-start text-left form-check'
  }, React__default.createElement("input", {
    type: 'radio',
    id: "check_" + index,
    "data-testid": "check_" + index,
    onChange: handleChange,
    role: 'button',
    checked: selectedAddress === address,
    className: 'form-check-input mr-1'
  }), React__default.createElement("label", {
    htmlFor: "check_" + index,
    role: 'button',
    "data-testid": "label_" + index,
    className: 'form-check-label text-nowrap trim-size-xl m-0'
  }, React__default.createElement("div", {
    className: 'd-flex align-items-center text-nowrap trim'
  }, React__default.createElement("span", null, trimHash(address)))))), React__default.createElement("td", {
    className: 'text-left'
  }, React__default.createElement(Denominate$1, {
    value: balance
  })), React__default.createElement("td", {
    className: 'text-left'
  }, index));
};

var ledgerWaitingText = 'Waiting for device';
var addressesPerPage = 10;

var AddressTable = function AddressTable(_ref) {
  var loading = _ref.loading,
      accounts = _ref.accounts,
      startIndex = _ref.startIndex,
      selectedAddress = _ref.selectedAddress,
      onGoToPrevPage = _ref.onGoToPrevPage,
      onGoToNextPage = _ref.onGoToNextPage,
      onConfirmSelectedAddress = _ref.onConfirmSelectedAddress,
      onSelectAddress = _ref.onSelectAddress,
      _ref$shouldRenderDefa = _ref.shouldRenderDefaultCss,
      shouldRenderDefaultCss = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'ledger-address-table' : _ref$className;
  var classes = getGeneratedClasses(className, shouldRenderDefaultCss, {
    wrapper: 'card my-4 text-center border-0',
    cardBody: 'card-body p-4 mx-lg-4',
    tableWrapper: 'table-responsive',
    tableContent: 'table m-0 border-bottom',
    tableHeader: 'py-2 text-semibold border-bottom',
    tableHeaderText: 'text-left border-0',
    buttonsWrapper: 'd-flex justify-content-center pager mt-2',
    arrowButton: 'btn btn-link mx-2',
    confirmButton: 'btn btn-primary px-4 mt-4'
  });

  switch (true) {
    case loading:
      return React__default.createElement(PageState$1, {
        className: className,
        icon: icons.faCircleNotch,
        iconClass: 'fa-spin text-primary',
        title: ledgerWaitingText
      });

    default:
      return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
        className: 'm-auto'
      }, React__default.createElement("div", {
        className: classes.wrapper
      }, React__default.createElement("div", {
        className: classes.cardBody
      }, React__default.createElement("div", {
        className: classes.tableWrapper,
        "data-testid": 'ledgerAddresses'
      }, React__default.createElement("table", {
        className: classes.tableContent
      }, React__default.createElement("thead", {
        className: classes.tableHeader
      }, React__default.createElement("tr", null, React__default.createElement("th", {
        className: classes.tableHeaderText
      }, "Address"), React__default.createElement("th", {
        className: classes.tableHeaderText
      }, "Balance"), React__default.createElement("th", {
        className: classes.tableHeaderText
      }, "#"))), React__default.createElement("tbody", {
        "data-testid": 'addressesTable'
      }, accounts.map(function (address, index) {
        var key = index + startIndex * addressesPerPage;
        return React__default.createElement(AddressRow, {
          key: key,
          address: address,
          index: key,
          selectedAddress: selectedAddress,
          onSelectAddress: onSelectAddress
        });
      })))), React__default.createElement("div", {
        className: classes.buttonsWrapper
      }, React__default.createElement("button", {
        type: 'button',
        className: classes.arrowButton,
        onClick: onGoToPrevPage,
        "data-testid": 'prevBtn',
        disabled: startIndex === 0
      }, React__default.createElement(ReactFontawesome$1.FontAwesomeIcon, {
        size: 'sm',
        icon: icons.faChevronLeft
      }), ' ', "Prev"), React__default.createElement("button", {
        type: 'button',
        className: classes.arrowButton,
        onClick: onGoToNextPage,
        "data-testid": 'nextBtn'
      }, "Next", ' ', React__default.createElement(ReactFontawesome$1.FontAwesomeIcon, {
        size: 'sm',
        icon: icons.faChevronRight
      }))), React__default.createElement("button", {
        className: classes.confirmButton,
        disabled: selectedAddress === '',
        onClick: onConfirmSelectedAddress,
        "data-testid": 'confirmBtn'
      }, "Confirm")))));
  }
};

var ConfirmAddress = function ConfirmAddress(_ref) {
  var token = _ref.token,
      noBorder = _ref.noBorder;

  var _useGetAccountInfo = useGetAccountInfo(),
      ledgerAccount = _useGetAccountInfo.ledgerAccount;

  return React__default.createElement("div", {
    className: 'm-auto'
  }, React__default.createElement("div", {
    className: "card my-4 text-center " + (noBorder ? 'border-0' : '')
  }, React__default.createElement("div", {
    className: 'card-body p-4 mx-lg-4'
  }, React__default.createElement("h4", {
    className: 'mb-4'
  }, "Confirm Ledger Address"), React__default.createElement("p", null, "For security, please confirm that your address: "), React__default.createElement("p", {
    className: 'lead border rounded p-2'
  }, ledgerAccount ? ledgerAccount.address : ''), token && React__default.createElement(React__default.Fragment, null, React__default.createElement("p", null, "and Auth Token"), React__default.createElement("p", {
    className: 'lead border rounded p-2'
  }, token + "{}")), React__default.createElement("p", {
    className: 'm-0'
  }, token ? 'are the one shown on your Ledger device screen now.' : 'is the one shown on your Ledger device screen now.'), React__default.createElement("p", null, "Select Approve on your device to confirm."), React__default.createElement("p", null, "Or, if it does not match, close this page and", ' ', React__default.createElement("a", Object.assign({
    href: 'https://help.elrond.com/en/'
  }, {
    target: '_blank'
  }), "contact support"), "."))));
};

var _defs, _g;

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }

var SvgLedgerNano = function SvgLedgerNano(props) {
  return /*#__PURE__*/createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    width: 110,
    height: 55,
    viewBox: "0 0 260 129"
  }, props), _defs || (_defs = /*#__PURE__*/createElement("defs", null, /*#__PURE__*/createElement("linearGradient", {
    id: "ledger-nano_svg__a",
    x1: "50%",
    x2: "50%",
    y1: "0%",
    y2: "100%"
  }, /*#__PURE__*/createElement("stop", {
    offset: "0%"
  }), /*#__PURE__*/createElement("stop", {
    offset: "100%",
    stopColor: "#FFF"
  })), /*#__PURE__*/createElement("path", {
    id: "ledger-nano_svg__b",
    d: "M91 0h34a4 4 0 0 1 4 4v108.144c0 11.519-9.337 20.856-20.856 20.856h-.288C96.337 133 87 123.663 87 112.144V4a4 4 0 0 1 4-4z"
  }))), _g || (_g = /*#__PURE__*/createElement("g", {
    fill: "none",
    fillRule: "evenodd"
  }, /*#__PURE__*/createElement("path", {
    className: "ledger-nano_svg__ledger-stroke",
    stroke: "#1D2027",
    strokeWidth: 2,
    d: "M127.856 31.44a1 1 0 0 1-1 1H100.63a5 5 0 0 1-5-5v-8.486a5 5 0 0 1 5-5h26.225a1 1 0 0 1 1 1v16.485z"
  }), /*#__PURE__*/createElement("path", {
    className: "ledger-nano_svg__ledger-stroke",
    stroke: "#142533",
    strokeWidth: 2,
    d: "M95.247 26.231H84.318v-6.435h10.93v6.435z"
  }), /*#__PURE__*/createElement("path", {
    className: "ledger-nano_svg__ledger-stroke",
    stroke: "#1D2027",
    strokeWidth: 2,
    d: "M127.923 28.726V17.471l6.977.083a1 1 0 0 1 .988 1v9.266a1 1 0 0 1-1.012.988l-6.953-.083z"
  }), /*#__PURE__*/createElement("path", {
    fill: "url(#ledger-nano_svg__a)",
    d: "M6.836 53.925h1.616v82.65H6.836v-82.65zm5.657 0h1.616v82.65h-1.616v-82.65z",
    transform: "matrix(0 -1 -1 0 137.5 33.44)"
  }), /*#__PURE__*/createElement("g", {
    transform: "rotate(-90 128.59 1.975)"
  }, /*#__PURE__*/createElement("rect", {
    className: "ledger-nano_svg__ledger-fill",
    width: 4.492,
    height: 17.12,
    x: 125.336,
    y: 15.505,
    fill: "#142533",
    rx: 2
  }), /*#__PURE__*/createElement("rect", {
    className: "ledger-nano_svg__ledger-fill",
    width: 4.492,
    height: 17.12,
    x: 125.336,
    y: 70.094,
    fill: "#142533",
    rx: 2
  }), /*#__PURE__*/createElement("use", {
    className: "ledger-nano_svg__ledger-fill-inner-bg",
    fill: "#FFF",
    xlinkHref: "#ledger-nano_svg__b"
  }), /*#__PURE__*/createElement("path", {
    className: "ledger-nano_svg__ledger-stroke",
    fill: "#6490F1",
    fillOpacity: 0.15,
    stroke: "#142533",
    strokeLinejoin: "square",
    strokeWidth: 2,
    d: "M91 1a3 3 0 0 0-3 3v108.144C88 123.11 96.89 132 107.856 132h.288C119.11 132 128 123.11 128 112.144V4a3 3 0 0 0-3-3H91z"
  }), /*#__PURE__*/createElement("rect", {
    className: "ledger-nano_svg__ledger-fill-outer-bg",
    width: 21,
    height: 62,
    x: 97.5,
    y: 21.5,
    fill: "#FFF",
    stroke: "#6490F1",
    rx: 1.6
  }), /*#__PURE__*/createElement("path", {
    fill: "#6490F1",
    d: "M105.5 35h5a.5.5 0 0 1 .5.5v34a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-34a.5.5 0 0 1 .5-.5zm1.238 3.042.774.512v.013l-.774.505.341.466.722-.577h.013l.243.899.551-.177-.328-.88.932.053v-.597l-.932.046.328-.873-.551-.17-.243.892h-.013l-.722-.584-.34.472zm0 3.908.774.512v.013l-.774.505.341.466.722-.578h.013l.243.9.551-.178-.328-.88.932.053v-.597l-.932.046.328-.872-.551-.17-.243.891h-.013l-.722-.584-.34.473zm0 3.907.774.512v.013l-.774.505.341.466.722-.577h.013l.243.899.551-.178-.328-.879.932.053v-.597l-.932.046.328-.873-.551-.17-.243.892h-.013l-.722-.584-.34.472zm0 3.908.774.511v.014l-.774.505.341.466.722-.578h.013l.243.899.551-.177-.328-.88.932.053v-.597l-.932.046.328-.872-.551-.171-.243.892h-.013l-.722-.584-.34.473zm0 3.907.774.512v.013l-.774.505.341.466.722-.577h.013l.243.898.551-.177-.328-.879.932.053v-.597l-.932.046.328-.873-.551-.17-.243.892h-.013l-.722-.584-.34.472zm0 3.908.774.511v.013l-.774.506.341.465.722-.577h.013l.243.899.551-.177-.328-.88.932.053v-.597l-.932.046.328-.873-.551-.17-.243.892h-.013l-.722-.584-.34.473zm0 3.907.774.512v.013l-.774.505.341.466.722-.578h.013l.243.9.551-.178-.328-.879.932.052v-.597l-.932.046.328-.872-.551-.17-.243.891h-.013l-.722-.583-.34.472zm0 3.907.774.512v.013l-.774.505.341.466.722-.577h.013l.243.899.551-.177-.328-.88.932.053v-.597l-.932.046.328-.873-.551-.17-.243.892h-.013l-.722-.584-.34.472z"
  }), /*#__PURE__*/createElement("path", {
    className: "ledger-nano_svg__ledger-stroke ledger-nano_svg__ledger-fill-outer-bg",
    fill: "#FFF",
    stroke: "#142533",
    strokeWidth: 2,
    d: "M123.166 125.105c7.049-8.4 5.953-20.925-2.447-27.974l-90.824-76.21a3 3 0 0 0-4.227.37L4 47.115a3 3 0 0 0 .37 4.227l90.824 76.21c8.4 7.049 20.924 5.953 27.973-2.447z"
  }), /*#__PURE__*/createElement("ellipse", {
    cx: 108.016,
    cy: 111.123,
    stroke: "#6490F1",
    rx: 10.57,
    ry: 10.644
  })))));
};

var LedgerConnect = function LedgerConnect(_ref) {
  var onClick = _ref.onClick,
      error = _ref.error,
      connectPageContent = _ref.connectPageContent;
  return React__default.createElement("div", {
    className: 'm-auto login-container'
  }, React__default.createElement("div", {
    className: 'card my-4 text-center border-0'
  }, React__default.createElement("div", {
    className: 'card-body p-4 mx-lg-4'
  }, connectPageContent ? React__default.createElement(React__default.Fragment, null, connectPageContent) : React__default.createElement(React__default.Fragment, null, React__default.createElement(SvgLedgerNano, {
    className: 'mb-4'
  }), React__default.createElement("h4", {
    className: 'mb-4'
  }, "Connect Ledger"), React__default.createElement("p", {
    className: 'lead mb-4'
  }, "Unlock your device & open the Elrond App.")), React__default.createElement("div", null, error && React__default.createElement("p", {
    className: 'text-danger d-flex justify-content-center align-items-center'
  }, error), React__default.createElement("button", {
    className: 'btn btn-primary px-4',
    onClick: onClick,
    "data-testid": 'connectBtn'
  }, "Connect Ledger")))));
};

var ledgerWaitingText$1 = 'Waiting for device';

function LedgerLoginContainer(_ref) {
  var callbackRoute = _ref.callbackRoute,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'login-modal-content' : _ref$className,
      _ref$shouldRenderDefa = _ref.shouldRenderDefaultCss,
      shouldRenderDefaultCss = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa,
      _ref$wrapContentInsid = _ref.wrapContentInsideModal,
      wrapContentInsideModal = _ref$wrapContentInsid === void 0 ? true : _ref$wrapContentInsid,
      redirectAfterLogin = _ref.redirectAfterLogin,
      onClose = _ref.onClose,
      token = _ref.token;
  var generatedClasses = getGeneratedClasses(className, shouldRenderDefaultCss, {
    spinner: 'fa-spin text-primary'
  });

  var _useGetAccountInfo = useGetAccountInfo(),
      ledgerAccount = _useGetAccountInfo.ledgerAccount;

  var _useLedgerLogin = useLedgerLogin({
    callbackRoute: callbackRoute,
    token: token,
    redirectAfterLogin: redirectAfterLogin
  }),
      onStartLogin = _useLedgerLogin[0],
      _useLedgerLogin$ = _useLedgerLogin[1],
      error = _useLedgerLogin$.error,
      isLoading = _useLedgerLogin$.isLoading,
      _useLedgerLogin$2 = _useLedgerLogin[2],
      showAddressList = _useLedgerLogin$2.showAddressList,
      accounts = _useLedgerLogin$2.accounts,
      onGoToPrevPage = _useLedgerLogin$2.onGoToPrevPage,
      onGoToNextPage = _useLedgerLogin$2.onGoToNextPage,
      onSelectAddress = _useLedgerLogin$2.onSelectAddress,
      onConfirmSelectedAddress = _useLedgerLogin$2.onConfirmSelectedAddress,
      startIndex = _useLedgerLogin$2.startIndex,
      selectedAddress = _useLedgerLogin$2.selectedAddress;

  function getContent() {
    if (isLoading) {
      return React__default.createElement(PageState$1, {
        icon: icons.faCircleNotch,
        iconClass: generatedClasses.spinner,
        title: ledgerWaitingText$1
      });
    }

    if (ledgerAccount != null && !error) {
      return React__default.createElement(ConfirmAddress, {
        token: token
      });
    }

    if (showAddressList && !error) {
      return React__default.createElement(AddressTable, {
        accounts: accounts,
        loading: isLoading,
        className: className,
        shouldRenderDefaultCss: shouldRenderDefaultCss,
        onGoToNextPage: onGoToNextPage,
        onGoToPrevPage: onGoToPrevPage,
        onSelectAddress: onSelectAddress,
        startIndex: startIndex,
        selectedAddress: selectedAddress == null ? void 0 : selectedAddress.address,
        onConfirmSelectedAddress: onConfirmSelectedAddress
      });
    }

    return React__default.createElement(LedgerConnect, {
      onClick: onStartLogin,
      error: error
    });
  }

  return wrapContentInsideModal ? React__default.createElement(ModalContainer, {
    title: 'Login with ledger',
    className: className,
    onClose: onClose
  }, getContent()) : getContent();
}

var LedgerLoginContainer$1 = /*#__PURE__*/withClassNameWrapper(LedgerLoginContainer);

var LedgerLoginButton = function LedgerLoginButton(_ref) {
  var token = _ref.token,
      callbackRoute = _ref.callbackRoute,
      children = _ref.children,
      onModalOpens = _ref.onModalOpens,
      onModalCloses = _ref.onModalCloses,
      _ref$loginButtonText = _ref.loginButtonText,
      loginButtonText = _ref$loginButtonText === void 0 ? 'Ledger' : _ref$loginButtonText,
      buttonClassName = _ref.buttonClassName,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'ledger-login' : _ref$className,
      _ref$redirectAfterLog = _ref.redirectAfterLogin,
      redirectAfterLogin = _ref$redirectAfterLog === void 0 ? false : _ref$redirectAfterLog,
      _ref$wrapContentInsid = _ref.wrapContentInsideModal,
      wrapContentInsideModal = _ref$wrapContentInsid === void 0 ? true : _ref$wrapContentInsid,
      _ref$shouldRenderDefa = _ref.shouldRenderDefaultCss,
      shouldRenderDefaultCss = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa,
      _ref$shouldRenderDefa2 = _ref.shouldRenderDefaultModalCss,
      shouldRenderDefaultModalCss = _ref$shouldRenderDefa2 === void 0 ? true : _ref$shouldRenderDefa2,
      _ref$hideButtonWhenMo = _ref.hideButtonWhenModalOpens,
      hideButtonWhenModalOpens = _ref$hideButtonWhenMo === void 0 ? false : _ref$hideButtonWhenMo;

  var _React$useState = React__default.useState(false),
      showLoginModal = _React$useState[0],
      setShowLoginModal = _React$useState[1];

  var generatedClasses = getGeneratedClasses(className, shouldRenderDefaultCss, {
    wrapper: "btn btn-primary px-sm-4 m-1 mx-sm-3 " + (buttonClassName != null ? buttonClassName : ''),
    loginText: 'text-left'
  });

  function handleOpenModal() {
    setShowLoginModal(true);
    onModalOpens == null ? void 0 : onModalOpens();
  }

  function handleCloseModal() {
    setShowLoginModal(false);
    onModalCloses == null ? void 0 : onModalCloses();
  }

  var shouldRenderButton = !hideButtonWhenModalOpens || !showLoginModal;
  return React__default.createElement("span", {
    className: wrapperClassName
  }, shouldRenderButton && React__default.createElement("button", {
    onClick: handleOpenModal,
    className: generatedClasses.wrapper
  }, children || React__default.createElement("span", {
    className: generatedClasses.loginText
  }, loginButtonText)), showLoginModal && React__default.createElement(LedgerLoginContainer$1, {
    className: className,
    shouldRenderDefaultCss: shouldRenderDefaultModalCss,
    callbackRoute: callbackRoute,
    token: token,
    wrapContentInsideModal: wrapContentInsideModal,
    redirectAfterLogin: redirectAfterLogin,
    onClose: handleCloseModal
  }));
};

var LedgerLoginButton$1 = /*#__PURE__*/withClassNameWrapper(LedgerLoginButton);

var _notificationTypesToI;
var typedIcons = icons;
var notificationTypesToIcons = (_notificationTypesToI = {}, _notificationTypesToI[NotificationTypesEnum.warning] = typedIcons.faExclamationTriangle, _notificationTypesToI);
var defaultIcon = typedIcons.faExclamationTriangle;
function NotificationModal() {
  var _useGetNotification = useGetNotification(),
      notification = _useGetNotification.notification,
      clearNotification = _useGetNotification.clearNotification;

  var showModal = Boolean(notification);

  var onDone = function onDone() {
    clearNotification();
  };

  var type = notification == null ? void 0 : notification.type;
  var icon = notification ? notificationTypesToIcons[type] || defaultIcon : null;
  return notification ? React__default.createElement(ReactBootstrap$1.Modal, {
    show: showModal,
    backdrop: true,
    onHide: notification,
    className: "modal-container " + wrapperClassName,
    animation: false,
    centered: true
  }, React__default.createElement("div", {
    className: 'card w-100 notification-modal'
  }, React__default.createElement(PageState$1, {
    icon: icon,
    iconClass: notification.iconClassName,
    iconBgClass: 'p-4 rounded-bg-circle',
    iconSize: '3x',
    title: notification.title,
    description: notification.description,
    action: React__default.createElement("button", {
      className: 'btn btn-primary',
      onClick: onDone
    }, "Done")
  }))) : null;
}

var Dot = function Dot(_ref) {
  var color = _ref.color,
      dataTestId = _ref['data-testid'];
  return React__default.createElement("span", {
    className: "dot " + color,
    "data-testid": dataTestId
  });
};

var ProgressSteps = function ProgressSteps(_ref) {
  var totalSteps = _ref.totalSteps,
      currentStep = _ref.currentStep,
      className = _ref.className;
  var dots = [];

  for (var i = 1; i <= totalSteps; i += 1) {
    var isCurrentStep = currentStep === i;
    var color = isCurrentStep || i < currentStep ? 'bg-primary' : 'bg-secondary';
    dots.push(React__default.createElement(Dot, {
      "data-testid": "step" + i + (isCurrentStep ? 'active' : ''),
      key: i,
      color: color
    }));
  }

  return React__default.createElement("div", {
    className: "progress-steps d-flex justify-content-center " + className
  }, React__default.createElement("div", {
    className: 'steps d-flex justify-content-center align-items-center position-relative'
  }, React__default.createElement("hr", {
    className: 'position-absolute w-100 m-0'
  }), dots));
};

var SignWithExtensionModal = function SignWithExtensionModal(_ref) {
  var handleClose = _ref.handleClose,
      error = _ref.error,
      callbackRoute = _ref.callbackRoute,
      transactions = _ref.transactions,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'extension-modal' : _ref$className;
  var classes = getGeneratedClasses(className, true, {
    wrapper: 'modal-container extension',
    icon: 'text-white',
    closeBtn: 'btn btn-close-link mt-2'
  });
  var description = error ? error : transactions && transactions.length > 1 ? 'Check your Elrond Wallet Extension to sign the transactions' : 'Check your Elrond Wallet Extension to sign the transaction';

  var close = function close(e) {
    e.preventDefault();
    handleClose();

    if (callbackRoute != null && !window.location.pathname.includes(callbackRoute)) {
      window.location.href = callbackRoute;
    }
  };

  return React__default.createElement(ReactBootstrap$1.Modal, {
    show: true,
    backdrop: 'static',
    onHide: handleClose,
    className: classnames$1(classes.wrapper, wrapperClassName),
    animation: false,
    centered: true
  }, React__default.createElement(PageState$1, {
    icon: error ? icons.faTimes : icons.faHourglass,
    iconClass: classes.icon,
    className: className,
    iconBgClass: error ? 'bg-danger' : 'bg-warning',
    iconSize: '3x',
    title: 'Confirm on Maiar DeFi Wallet',
    description: description,
    action: React__default.createElement("button", {
      id: 'closeButton',
      "data-testid": 'closeButton',
      onClick: close,
      className: classes.closeBtn
    }, "Close")
  }));
};

var _g$1;

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }

var SvgEgld = function SvgEgld(props) {
  return /*#__PURE__*/createElement("svg", _extends$2({
    viewBox: "0 0 100 100",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), _g$1 || (_g$1 = /*#__PURE__*/createElement("g", {
    fillRule: "nonzero"
  }, /*#__PURE__*/createElement("path", {
    d: "M79.6 19.424c-.4-.438-.6-.877-.6-1.425 0-.547.2-.986.6-1.424.8-.767 2-.767 2.8 0 .4.438.6.877.6 1.424 0 .548-.2.987-.6 1.425-.4.329-.9.548-1.4.548-.5.11-1-.11-1.4-.548M74.556 24.448c-.333-.441-.556-.883-.556-1.435s.223-.993.556-1.434c.778-.772 2.111-.772 2.889 0 .333.441.555.883.555 1.435s-.222.993-.555 1.434C77 24.779 76.556 25 76 25s-1-.221-1.445-.552M69.556 30.448c-.333-.331-.556-.883-.556-1.435s.223-.993.556-1.434c.778-.772 2.111-.772 2.889 0 .333.331.555.883.555 1.435s-.222.993-.555 1.434C72 30.889 71.556 31 71 31s-1.112-.221-1.445-.552M64.6 35.448c-.4-.331-.6-.883-.6-1.435s.2-.993.6-1.434c.8-.772 2-.772 2.8 0 .4.331.6.883.6 1.435s-.2 1.103-.6 1.434c-.4.441-.9.552-1.4.552s-1-.11-1.4-.552M59.556 40.424c-.444-.329-.556-.877-.556-1.425 0-.547.223-.986.556-1.424.778-.767 2.111-.767 2.889 0 .444.329.555.877.555 1.424 0 .548-.222 1.096-.555 1.425-.333.438-.889.548-1.445.548a1.457 1.457 0 0 1-1.444-.548M53 44.014c0-.552.222-.993.556-1.435.777-.772 2.11-.772 2.888 0 .445.442.556.883.556 1.435s-.222.993-.556 1.435c-.333.33-.888.551-1.444.551s-1-.22-1.444-.551c-.334-.332-.556-.883-.556-1.435zM43.556 56.424c-.333-.329-.556-.877-.556-1.425 0-.547.223-.986.556-1.424.778-.767 2.111-.767 2.889 0 .444.438.555.877.555 1.424 0 .548-.222.987-.555 1.425-.333.438-.889.548-1.445.548-.555.11-1-.11-1.444-.548M38.6 61.424c-.4-.329-.6-.877-.6-1.425 0-.547.2-.986.6-1.424.8-.767 2-.767 2.8 0 .4.438.6.877.6 1.424 0 .548-.2.987-.6 1.425-.4.438-.9.548-1.4.548-.5.11-1-.11-1.4-.548M33.556 66.448c-.333-.331-.556-.883-.556-1.435s.223-1.103.556-1.434c.778-.772 2.111-.772 2.889 0 .333.331.555.883.555 1.434s-.222.994-.555 1.435C36 66.889 35.556 67 35 67s-1-.221-1.444-.552M27.556 71.448c-.444-.331-.556-.883-.556-1.435s.223-.993.556-1.434c.778-.772 2.111-.772 2.889 0 .333.441.555.883.555 1.435s-.222 1.103-.555 1.434C30 71.889 29.556 72 29 72s-1.112-.11-1.445-.552M22.615 76.448c-.41-.331-.615-.883-.615-1.435s.205-.993.615-1.434c.82-.772 2.051-.772 2.77 0 .41.441.615.883.615 1.435s-.206 1.103-.616 1.434c-.41.331-.923.552-1.436.552-.513 0-1.025-.11-1.333-.552M17.556 82.424c-.444-.438-.556-.877-.556-1.425 0-.547.223-.986.556-1.424.778-.767 2.111-.767 2.889 0 .444.438.555.877.555 1.425 0 .547-.222.986-.555 1.424-.333.329-.889.548-1.444.548-.445.11-1-.11-1.445-.548M20.444 19.424c.333-.438.556-.877.556-1.425 0-.547-.223-.986-.556-1.424-.778-.767-2.111-.767-2.889 0-.444.438-.555.877-.555 1.424 0 .548.222.987.555 1.425.333.329.889.548 1.444.548.556.11 1.112-.11 1.445-.548M25.4 24.448c.4-.441.6-.883.6-1.435s-.2-.993-.6-1.434c-.8-.772-2-.772-2.8 0-.4.441-.6.883-.6 1.435s.2.993.6 1.434c.4.331.9.552 1.4.552s1-.221 1.4-.552M30.444 30.448c.333-.331.556-.883.556-1.435s-.223-.993-.556-1.434c-.778-.772-2.111-.772-2.889 0-.333.331-.555.883-.555 1.435s.222.993.555 1.434C28 30.889 28.444 31 29 31c.445 0 1-.221 1.445-.552M36.444 35.448c.333-.331.556-.883.556-1.435s-.223-.993-.556-1.434c-.778-.772-2.111-.772-2.889 0-.333.331-.555.883-.555 1.435s.222 1.103.555 1.434C34 35.889 34.444 36 35 36c.444 0 1-.11 1.444-.552M41.385 40.424c.41-.329.615-.877.615-1.425 0-.547-.205-.986-.615-1.424-.718-.767-2.051-.767-2.77 0-.41.329-.615.877-.615 1.424 0 .548.206 1.096.616 1.425.41.438.923.548 1.436.548.513.11 1.025-.11 1.333-.548M47 44.014c0-.552-.222-.993-.556-1.435-.777-.772-2.11-.772-2.888 0-.445.442-.556.883-.556 1.435s.222.993.556 1.435c.333.33.888.551 1.444.551s1-.22 1.444-.551c.445-.332.556-.883.556-1.435zM51.444 51.448c.444-.441.556-.883.556-1.435s-.223-.993-.556-1.434c-.778-.772-2.111-.772-2.889 0-.444.441-.555.883-.555 1.435s.222.993.555 1.434c.333.331.889.552 1.445.552s1.11-.221 1.444-.552M56.385 56.424c.41-.329.615-.877.615-1.425 0-.547-.205-.986-.615-1.424-.82-.767-2.051-.767-2.77 0-.41.438-.615.877-.615 1.424 0 .548.206.987.616 1.425.41.438.923.548 1.436.548.41.11.923-.11 1.333-.548M62.444 61.424c.333-.329.556-.877.556-1.425 0-.547-.223-.986-.556-1.424-.778-.767-2.111-.767-2.889 0-.333.438-.555.877-.555 1.424 0 .548.222.987.555 1.425.445.438.889.548 1.445.548.444.11 1-.11 1.444-.548M67.444 66.448c.333-.331.556-.883.556-1.435s-.223-1.103-.556-1.434c-.778-.772-2.111-.772-2.889 0-.333.331-.555.883-.555 1.434s.222.994.555 1.435C65 66.889 65.444 67 66 67s1-.221 1.445-.552M72.444 71.448c.444-.331.556-.883.556-1.435s-.223-.993-.556-1.434c-.778-.772-2.111-.772-2.889 0-.333.441-.555.883-.555 1.435s.222 1.103.555 1.434C70 71.889 70.444 72 71 72s1.112-.11 1.445-.552M77.444 76.448c.444-.331.556-.883.556-1.435s-.223-.993-.556-1.434c-.778-.772-2.111-.772-2.889 0-.444.441-.555.883-.555 1.435s.222 1.103.555 1.434c.333.331.889.552 1.444.552s1.112-.11 1.445-.552M82.385 82.424c.41-.438.615-.877.615-1.425 0-.547-.205-.986-.615-1.424-.82-.767-2.051-.767-2.77 0-.41.438-.615.877-.615 1.425 0 .547.206.986.616 1.424.41.329.923.548 1.436.548.41.11.923-.11 1.333-.548M33.036 21c5.265-3.433 11.036-5.048 17.414-5.149 6.277 0 12.048 1.716 17.414 5.149L79.001 9.894C70.294 3.331 60.878 0 50.45 0 40.022 0 30.505 3.332 22.001 9.894L33.037 21zM21 66.742c-3.585-5.375-5.327-11.157-5.327-17.343 0-6.288 1.742-12.069 5.327-17.343L9.834 21.001C3.278 29.521 0 38.953 0 49.501c0 10.345 3.278 19.879 9.937 28.5L21 66.743zM67.964 78c-5.265 3.533-11.036 5.35-17.313 5.451-6.378 0-12.25-1.716-17.515-5.35L21.999 89.105c8.606 6.663 18.123 9.994 28.652 9.893 10.428-.1 19.844-3.432 28.348-9.893L67.963 78zM79 32.258c3.533 5.375 5.35 11.258 5.25 17.648-.102 6.187-1.818 11.867-5.25 17.039L90.105 78c6.562-8.52 9.893-17.952 9.893-28.297.101-10.548-3.23-20.082-9.893-28.703L79 32.258zM90 81c4.364 0 8 3.533 8 8 0 4.364-3.533 8-8 8-4.364 0-8-3.533-8-8s3.533-8 8-8M10 81c4.421 0 8 3.533 8 8 0 4.364-3.579 8-8 8-4.421 0-8-3.533-8-8s3.579-8 8-8M90 1c4.421 0 8 3.533 8 8 0 4.468-3.579 8-8 8s-8-3.533-8-8c0-4.468 3.579-8 8-8M10 1c4.364 0 8 3.579 8 8 0 4.421-3.533 8-8 8-4.364 0-8-3.579-8-8 0-4.421 3.533-8 8-8"
  }))));
};

var Simple = function Simple(_ref) {
  var children = _ref.children;
  return createElement("div", {
    className: 'token-symbol'
  }, children);
};
var Combined = function Combined(_ref2) {
  var small = _ref2.small,
      children = _ref2.children;
  return createElement("div", {
    className: "token-symbol-combined " + (small ? 'small' : '')
  }, children);
};

var getIdentifierWithoutNonce = function getIdentifierWithoutNonce(identifier) {
  var tokenParts = identifier.split('-');
  return identifier.includes('-') ? tokenParts[0] + "-" + tokenParts[1] : identifier;
};

function getIcon(isEgldTransfer, tokenAvatar) {
  if (tokenAvatar) {
    return React__default.createElement("img", {
      className: 'token-symbol-custom-token',
      src: tokenAvatar
    });
  }

  return isEgldTransfer ? React__default.createElement(SvgEgld, null) : React__default.createElement(ReactFontawesome$1.FontAwesomeIcon, {
    icon: icons.faDiamond
  });
}

var getDetails = function getDetails(token, tokenAvatar) {
  var egldLabel = getEgldLabel();
  var isEgldTransfer = token === egldLabel;
  return {
    token: token,
    symbol: token ? token.split('-')[0] : '',
    label: token,
    // eslint-disable-next-line react/display-name
    icon: function icon() {
      return getIcon(isEgldTransfer, tokenAvatar);
    }
  };
};

var TokenDetails = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(TokenDetails, _React$Component);

  function TokenDetails() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = TokenDetails.prototype;

  _proto.render = function render() {
    return null;
  };

  return TokenDetails;
}(React__default.Component);

TokenDetails.Token = function (props) {
  return React__default.createElement(React__default.Fragment, null, props.token);
};

TokenDetails.Symbol = function (props) {
  return React__default.createElement(React__default.Fragment, null, getDetails(getIdentifierWithoutNonce(props.token), props.tokenAvatar).symbol);
};

TokenDetails.Label = function (props) {
  return React__default.createElement(React__default.Fragment, null, getDetails(getIdentifierWithoutNonce(props.token), props.tokenAvatar).label);
};

TokenDetails.Icon = function (props) {
  var Component = process.env.NODE_ENV !== 'test' ? getDetails(getIdentifierWithoutNonce(props.token), props.tokenAvatar).icon : function () {
    return null;
  };
  return React__default.createElement("span", {
    className: wrapperClassName
  }, props.combined ? React__default.createElement(Combined, {
    small: props.small
  }, React__default.createElement(Component, null)) : React__default.createElement(Simple, null, React__default.createElement(Component, null)));
};

var allOccurences = function allOccurences(sourceStr, searchStr) {
  return [].concat(sourceStr.matchAll(new RegExp(searchStr, 'gi'))).map(function (a) {
    return a.index;
  });
};

var TransactionData = function TransactionData(_ref) {
  var data = _ref.data,
      highlight = _ref.highlight,
      isScCall = _ref.isScCall;
  var output = createElement(Fragment, null, data);

  var _ref2 = highlight && isScCall ? highlight.split('@') : [],
      encodedScCall = _ref2[0],
      remainingDataFields = _ref2.slice(1);

  if (data && highlight && allOccurences(data, highlight).length === 1) {
    switch (true) {
      case data.startsWith(highlight):
        {
          var _data$split = data.split(highlight),
              rest = _data$split[1];

          output = createElement(Fragment, null, highlight, createElement("span", {
            className: 'text-muted'
          }, rest));
          break;
        }

      case data.endsWith(highlight):
        {
          var _data$split2 = data.split(highlight),
              _rest = _data$split2[0];

          output = createElement(Fragment, null, createElement("span", {
            className: 'text-muted'
          }, _rest), highlight);
          break;
        }

      default:
        {
          var _data$split3 = data.split(highlight),
              start = _data$split3[0],
              end = _data$split3[1];

          output = createElement(Fragment, null, createElement("span", {
            className: 'text-muted'
          }, start), createElement("span", {
            className: 'highlighted'
          }, highlight), createElement("span", {
            className: 'text-muted'
          }, end));
          break;
        }
    }
  }

  return createElement(Fragment, null, encodedScCall && createElement("div", {
    className: 'form-group mb-0 data-field mw-100'
  }, createElement("span", {
    className: 'form-label text-secondary d-block'
  }, "SC Call"), createElement("div", {
    "data-testid": 'confirmScCall',
    className: 'textarea sc-call form-control cursor-text mt-1 text-break-all'
  }, [decodePart(encodedScCall)].concat(remainingDataFields).join('@'))), createElement("div", {
    className: 'form-group mb-0 data-field mw-100'
  }, createElement("span", {
    className: 'form-label text-secondary d-block'
  }, "Data"), createElement("div", {
    "data-testid": 'confirmData',
    className: 'textarea form-control cursor-text mt-1 text-break-all'
  }, data ? output : 'N/A')));
};

var TransactionData$1 = /*#__PURE__*/withClassNameWrapper(TransactionData);

var SignStep = function SignStep(_ref) {
  var onSignTransaction = _ref.onSignTransaction,
      handleClose = _ref.handleClose,
      onPrev = _ref.onPrev,
      title = _ref.title,
      waitingForDevice = _ref.waitingForDevice,
      currentTransaction = _ref.currentTransaction,
      error = _ref.error,
      allTransactions = _ref.allTransactions,
      isLastTransaction = _ref.isLastTransaction,
      currentStep = _ref.currentStep,
      className = _ref.className;
  var egldLabel = getEgldLabel();

  if (!currentTransaction) {
    return null;
  }

  var transactionData = currentTransaction.transaction.getData().toString();

  var _useGetNetworkConfig = useGetNetworkConfig(),
      network = _useGetNetworkConfig.network;

  var _currentTransaction$t = currentTransaction.transactionTokenInfo,
      tokenId = _currentTransaction$t.tokenId,
      amount = _currentTransaction$t.amount,
      type = _currentTransaction$t.type,
      multiTxData = _currentTransaction$t.multiTxData,
      receiver = _currentTransaction$t.receiver;
  var isTokenTransaction = Boolean(tokenId && isTokenTransfer({
    tokenId: tokenId,
    erdLabel: egldLabel
  }));
  var isFirst = currentStep === 0;

  var onCloseClick = function onCloseClick(e) {
    e.preventDefault();

    if (isFirst) {
      handleClose();
    } else {
      onPrev();
    }
  };

  var continueWithoutSigning = type && multiTxData && !transactionData.endsWith(multiTxData);
  var signBtnLabel = 'Sign & Continue';
  signBtnLabel = waitingForDevice ? 'Check your Ledger' : signBtnLabel;
  signBtnLabel = isLastTransaction && !waitingForDevice ? 'Sign & Submit' : signBtnLabel;
  signBtnLabel = continueWithoutSigning ? 'Continue' : signBtnLabel;

  var _useGetTokenDetails = useGetTokenDetails({
    tokenId: currentTransaction.transactionTokenInfo.tokenId
  }),
      tokenDenomination = _useGetTokenDetails.tokenDenomination,
      tokenAvatar = _useGetTokenDetails.tokenAvatar;

  var denominatedAmount = denominate({
    input: isTokenTransaction ? amount : currentTransaction.transaction.getValue().toString(),
    denomination: isTokenTransaction ? tokenDenomination : Number(network.egldDenomination),
    decimals: Number(network.decimals),
    showLastNonZeroDecimal: false,
    addCommas: true
  });
  var scamReport = currentTransaction.receiverScamInfo;
  var showProgressSteps = allTransactions.length > 1;
  var classes = getGeneratedClasses(className, true, {
    formGroup: 'form-group text-left',
    formLabel: 'form-label text-secondary',
    icon: 'text-white',
    contentWrapper: 'd-flex flex-column justify-content-start flex-md-row justify-content-md-between mb-3',
    tokenWrapper: 'mb-3 mb-md-0 d-flex flex-column align-items-start',
    tokenLabel: 'text-secondary text-left',
    tokenValue: 'd-flex align-items-center mt-1',
    scamReport: 'text-warning',
    scamReportIcon: 'text-warning mr-1',
    tokenAmountLabel: 'text-secondary text-left',
    tokenAmountValue: 'd-flex align-items-center',
    dataFormGroup: 'form-group text-left',
    errorMessage: 'text-danger d-flex justify-content-center align-items-center',
    buttonsWrapper: 'd-flex align-items-center justify-content-end mt-spacer',
    cancelButton: 'btn btn-dark text-white flex-even mr-2',
    signButton: "btn " + (scamReport ? 'btn-warning' : 'btn-primary') + " flex-even ml-2"
  });
  return React__default.createElement(PageState$1, {
    icon: error ? icons.faTimes : icons.faHourglass,
    iconClass: classes.icon,
    iconBgClass: error ? 'bg-danger' : 'bg-warning',
    iconSize: '3x',
    className: className,
    title: title || 'Confirm on Ledger',
    description: React__default.createElement(React__default.Fragment, null, currentTransaction.transaction && React__default.createElement(React__default.Fragment, null, showProgressSteps && React__default.createElement(ProgressSteps, {
      totalSteps: allTransactions.length,
      currentStep: currentStep + 1,
      className: 'mb-4'
    }), React__default.createElement("div", {
      className: classes.formGroup,
      "data-testid": 'transactionTitle'
    }, React__default.createElement("div", {
      className: classes.formLabel
    }, "To: "), multiTxData ? new Address$1(receiver).bech32() : currentTransaction.transaction.getReceiver().toString(), scamReport && React__default.createElement("div", {
      className: classes.scamReport
    }, React__default.createElement("span", null, React__default.createElement(ReactFontawesome$1.FontAwesomeIcon, {
      icon: icons.faExclamationTriangle,
      className: classes.scamReportIcon
    }), React__default.createElement("small", null, scamReport)))), React__default.createElement("div", {
      className: classes.contentWrapper
    }, React__default.createElement("div", {
      className: classes.tokenWrapper
    }, React__default.createElement("div", {
      className: classes.tokenlabel
    }, "Token"), React__default.createElement("div", {
      className: classes.tokenValue
    }, React__default.createElement(TokenDetails.Icon, {
      tokenAvatar: tokenAvatar,
      token: tokenId || egldLabel
    }), React__default.createElement("div", {
      className: 'mr-1'
    }), React__default.createElement(TokenDetails.Label, {
      token: tokenId || egldLabel
    }))), React__default.createElement("div", null, React__default.createElement("div", {
      className: classes.tokenAmountLabel
    }, "Amount"), React__default.createElement("div", {
      className: classes.tokenAmountValue
    }, React__default.createElement("div", {
      className: 'mr-1'
    }, denominatedAmount), React__default.createElement(TokenDetails.Symbol, {
      token: tokenId || egldLabel
    })))), React__default.createElement("div", {
      className: classes.dataFormGroup
    }, currentTransaction.transaction.getData() && React__default.createElement(TransactionData$1, Object.assign({}, {
      data: currentTransaction.transaction.getData().toString(),
      highlight: multiTxData,
      isScCall: !tokenId
    }))), error && React__default.createElement("p", {
      className: classes.errorMessage
    }, error))),
    action: React__default.createElement("div", {
      className: classes.buttonsWrapper
    }, React__default.createElement("button", {
      id: 'closeButton',
      "data-testid": 'closeButton',
      onClick: onCloseClick,
      className: classes.cancelButton
    }, isFirst ? 'Cancel' : 'Back'), React__default.createElement("button", {
      type: 'button',
      className: classes.signButton,
      id: 'signBtn',
      "data-testid": 'signBtn',
      onClick: onSignTransaction,
      disabled: waitingForDevice
    }, signBtnLabel))
  });
};

var SignWithLedgerModal = function SignWithLedgerModal(_ref) {
  var handleClose = _ref.handleClose,
      error = _ref.error,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'ledger-modal' : _ref$className,
      _ref$verifyReceiverSc = _ref.verifyReceiverScam,
      verifyReceiverScam = _ref$verifyReceiverSc === void 0 ? true : _ref$verifyReceiverSc,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? 'Confirm on Ledger' : _ref$title;

  var _useSignTransactionsW = useSignTransactionsWithLedger({
    onCancel: handleClose,
    verifyReceiverScam: verifyReceiverScam
  }),
      onSignTransaction = _useSignTransactionsW.onSignTransaction,
      onNext = _useSignTransactionsW.onNext,
      onPrev = _useSignTransactionsW.onPrev,
      allTransactions = _useSignTransactionsW.allTransactions,
      waitingForDevice = _useSignTransactionsW.waitingForDevice,
      onAbort = _useSignTransactionsW.onAbort,
      isLastTransaction = _useSignTransactionsW.isLastTransaction,
      currentStep = _useSignTransactionsW.currentStep,
      callbackRoute = _useSignTransactionsW.callbackRoute,
      currentTransaction = _useSignTransactionsW.currentTransaction;

  var classes = getGeneratedClasses(className, true, {
    wrapper: 'modal-container wallet-connect',
    container: 'card container',
    cardBody: 'card-body'
  });
  return React__default.createElement(ReactBootstrap$1.Modal, {
    show: currentTransaction != null,
    backdrop: 'static',
    onHide: handleClose,
    className: classnames$1(classes.wrapper, wrapperClassName),
    animation: false,
    centered: true
  }, React__default.createElement("div", {
    className: classes.container
  }, React__default.createElement("div", {
    className: classes.cardBody
  }, React__default.createElement(SignStep, Object.assign({}, {
    onSignTransaction: onSignTransaction,
    onNext: onNext,
    onPrev: onPrev,
    allTransactions: allTransactions,
    waitingForDevice: waitingForDevice,
    isLastTransaction: isLastTransaction,
    currentStep: currentStep,
    callbackRoute: callbackRoute,
    currentTransaction: currentTransaction,
    handleClose: onAbort,
    className: className,
    error: error,
    title: title
  })))));
};

var SignWithWalletConnectModal = function SignWithWalletConnectModal(_ref) {
  var error = _ref.error,
      handleClose = _ref.handleClose,
      callbackRoute = _ref.callbackRoute,
      transactions = _ref.transactions,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'wallet-connect-modal' : _ref$className;
  var classes = getGeneratedClasses(className, true, {
    wrapper: 'modal-container wallet-connect',
    icon: 'text-white',
    closeBtn: 'btn btn-close-link mt-2'
  });
  var hasMultipleTransactions = transactions && (transactions == null ? void 0 : transactions.length) > 1;
  var description = error ? error : "Check your phone to sign the transaction" + (hasMultipleTransactions ? 's' : '');

  var close = function close(e) {
    e.preventDefault();
    handleClose();

    if (callbackRoute != null && !window.location.pathname.includes(callbackRoute)) {
      window.location.href = callbackRoute;
    }
  };

  return React__default.createElement(ReactBootstrap$1.Modal, {
    show: true,
    backdrop: 'static',
    onHide: close,
    className: classnames$1(classes.wrapper, wrapperClassName),
    animation: false,
    centered: true
  }, React__default.createElement(PageState$1, {
    icon: error ? icons.faTimes : icons.faHourglass,
    iconClass: classes.icon,
    className: className,
    iconBgClass: error ? 'bg-danger' : 'bg-warning',
    iconSize: '3x',
    title: 'Confirm on Maiar',
    description: description,
    action: React__default.createElement("button", {
      id: 'closeButton',
      "data-testid": 'closeButton',
      onClick: close,
      className: classes.closeBtn
    }, "Close")
  }));
};

function SignTransactionsModals(_ref) {
  var className = _ref.className,
      CustomConfirmScreens = _ref.CustomConfirmScreens,
      _ref$verifyReceiverSc = _ref.verifyReceiverScam,
      verifyReceiverScam = _ref$verifyReceiverSc === void 0 ? true : _ref$verifyReceiverSc;

  var _useSignTransactions = useSignTransactions(),
      callbackRoute = _useSignTransactions.callbackRoute,
      transactions = _useSignTransactions.transactions,
      error = _useSignTransactions.error,
      sessionId = _useSignTransactions.sessionId,
      onAbort = _useSignTransactions.onAbort,
      hasTransactions = _useSignTransactions.hasTransactions;

  var _useGetAccountProvide = useGetAccountProvider(),
      providerType = _useGetAccountProvide.providerType;

  var signTransactionsError = useGetSignTransactionsError();

  var _useGetLoginInfo = useGetLoginInfo(),
      loginMethod = _useGetLoginInfo.loginMethod;

  var handleClose = function handleClose() {
    onAbort(sessionId);
  };

  var signError = error || signTransactionsError;
  var signProps = {
    handleClose: handleClose,
    error: signError,
    sessionId: sessionId,
    transactions: transactions,
    providerType: providerType,
    callbackRoute: callbackRoute,
    className: className,
    verifyReceiverScam: verifyReceiverScam
  };

  if (signError || hasTransactions) {
    switch (loginMethod) {
      case LoginMethodsEnum.ledger:
        return CustomConfirmScreens != null && CustomConfirmScreens.Ledger ? React__default.createElement(CustomConfirmScreens.Ledger, Object.assign({}, signProps)) : React__default.createElement(SignWithLedgerModal, Object.assign({}, signProps));

      case LoginMethodsEnum.walletconnect:
        return CustomConfirmScreens != null && CustomConfirmScreens.WalletConnect ? React__default.createElement(CustomConfirmScreens.WalletConnect, Object.assign({}, signProps)) : React__default.createElement(SignWithWalletConnectModal, Object.assign({}, signProps));

      case LoginMethodsEnum.extension:
        return CustomConfirmScreens != null && CustomConfirmScreens.Extension ? React__default.createElement(CustomConfirmScreens.Extension, Object.assign({}, signProps)) : React__default.createElement(SignWithExtensionModal, Object.assign({}, signProps));

      case LoginMethodsEnum.extra:
        return CustomConfirmScreens != null && CustomConfirmScreens.Extra ? React__default.createElement(CustomConfirmScreens.Extra, Object.assign({}, signProps)) : null;

      default:
        return null;
    }
  }

  return null;
}

var index$5 = /*#__PURE__*/withClassNameWrapper(SignTransactionsModals);

var SessionStorageKeysEnum;

(function (SessionStorageKeysEnum) {
  SessionStorageKeysEnum["toasts"] = "toasts";
})(SessionStorageKeysEnum || (SessionStorageKeysEnum = {}));

function setToastsIdsToStorage(ids) {
  return sessionStorage.setItem(SessionStorageKeysEnum.toasts, JSON.stringify(ids));
}
function getToastsIdsFromStorage() {
  var toastsIds = sessionStorage.getItem(SessionStorageKeysEnum.toasts);
  return toastsIds != null ? JSON.parse(toastsIds) : [];
}

function isCrossShardTransaction(_ref) {
  var receiverAddress = _ref.receiverAddress,
      senderShard = _ref.senderShard,
      senderAddress = _ref.senderAddress;

  try {
    var receiver = new Address$1(receiverAddress);
    var receiverShard = getShardOfAddress(receiver.pubkey());

    if (senderShard == null && senderAddress != null) {
      var sender = new Address$1(senderAddress);
      return getShardOfAddress(sender) === receiverShard;
    }

    return receiverShard === senderShard;
  } catch (err) {
    return false;
  }
}

var IconState = function IconState(_ref) {
  var icon = _ref.icon,
      _ref$iconSize = _ref.iconSize,
      iconSize = _ref$iconSize === void 0 ? '3x' : _ref$iconSize,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'icon-state' : _ref$className,
      _ref$shouldRenderDefa = _ref.shouldRenderDefaultCss,
      shouldRenderDefaultCss = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa;
  var generatedClasses = getGeneratedClasses(className, shouldRenderDefaultCss, {
    wrapper: classnames$1('icon-state mx-auto', className, {
      half: iconSize === '2x'
    }),
    icon: classnames$1('text-white', className)
  });
  return React__default.createElement("span", {
    className: generatedClasses.wrapper
  }, React__default.createElement(ReactFontawesome$1.FontAwesomeIcon, {
    icon: icon,
    size: iconSize,
    className: generatedClasses.icon
  }));
};

var IconState$1 = /*#__PURE__*/withClassNameWrapper(IconState);

var Progress = function Progress(_ref) {
  var id = _ref.id,
      children = _ref.children,
      progress = _ref.progress,
      done = _ref.done,
      _ref$expiresIn = _ref.expiresIn,
      expiresIn = _ref$expiresIn === void 0 ? 10 * 60 : _ref$expiresIn;
  var ref = React__default.useRef(null);
  var intervalRef = React__default.useRef();

  var removeTxFromSession = function removeTxFromSession() {
    var toastProgress = storage$1.session.getItem('toastProgress');
    var hasSessionStoredTx = Boolean(toastProgress == null ? void 0 : toastProgress[id]);

    if (!hasSessionStoredTx) {
      return;
    }

    var expires = moment$1().add(expiresIn, 'seconds').unix();
    delete toastProgress[id];
    storage$1.session.setItem({
      key: 'toastProgress',
      data: toastProgress,
      expires: expires
    });
  };

  var saveToSession = function saveToSession(_ref2) {
    var value = _ref2.value;
    var toastProgress = storage$1.session.getItem('toastProgress') || {};
    toastProgress[id] = value;
    storage$1.session.setItem({
      key: 'toastProgress',
      data: toastProgress,
      expires: moment$1().add(expiresIn, 'seconds').unix()
    });
  };

  var getInitialData = function getInitialData() {
    var totalSeconds = progress ? progress.endTime - progress.startTime : 0;
    var toastProgress = storage$1.session.getItem('toastProgress');
    var remaining = progress ? (progress.endTime - moment$1().unix()) * 100 / totalSeconds : 0;
    var currentRemaining = toastProgress && id in toastProgress ? toastProgress[id] : remaining;
    return {
      currentRemaining: currentRemaining,
      totalSeconds: totalSeconds
    };
  };

  var _getInitialData = getInitialData(),
      totalSeconds = _getInitialData.totalSeconds,
      currentRemaining = _getInitialData.currentRemaining;

  var _React$useState = React__default.useState(currentRemaining),
      percentRemaining = _React$useState[0],
      setPercentRemaining = _React$useState[1];

  React__default.useEffect(function () {
    if (progress) {
      var maxPercent = 90;
      var perc = totalSeconds / maxPercent;

      var _int = moment$1.duration(perc.toFixed(2), 's').asMilliseconds();

      if (done) {
        intervalRef.current = setInterval(function () {
          if (ref.current !== null) {
            setPercentRemaining(function (existing) {
              var value = existing - 1;

              if (value <= 0) {
                clearInterval(intervalRef.current);
                removeTxFromSession();
                return 0;
              } else {
                saveToSession({
                  value: value
                });
                return value;
              }
            });
          }
        }, 5);
      } else {
        intervalRef.current = setInterval(function () {
          if (ref.current !== null) {
            setPercentRemaining(function (existing) {
              var decrement = existing > 100 - maxPercent ? 1 : logarithmicRest(existing);
              var value = existing - decrement;
              saveToSession({
                value: value
              });
              return value;
            });
          }
        }, _int);
      }

      return function () {
        clearInterval(intervalRef.current);
      };
    }

    return;
  }, [progress, done]);
  return progress ? React__default.createElement("div", {
    className: 'progress position-relative',
    ref: ref
  }, React__default.createElement("div", {
    className: 'progress-bar',
    role: 'progressbar',
    style: {
      width: percentRemaining + "%"
    },
    "aria-valuenow": percentRemaining,
    "aria-valuemin": 0,
    "aria-valuemax": 100
  }, React__default.createElement("div", {
    className: 'content-height'
  }, children)), React__default.createElement("div", {
    className: 'd-flex position-absolute w-100'
  }, children)) : React__default.createElement(React__default.Fragment, null, children);
};

var Progress$1 = /*#__PURE__*/withClassNameWrapper(Progress);

function fallbackCopyTextToClipboard(text) {
  var success = false;
  var textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    success = true;
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
  return success;
}

function copyTextToClipboard(_x) {
  return _copyTextToClipboard.apply(this, arguments);
}

function _copyTextToClipboard() {
  _copyTextToClipboard = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(text) {
    var success;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            success = false;

            if (navigator.clipboard) {
              _context.next = 5;
              break;
            }

            success = fallbackCopyTextToClipboard(text);
            _context.next = 8;
            break;

          case 5:
            _context.next = 7;
            return navigator.clipboard.writeText(text).then(function done() {
              return true;
            }, function error(err) {
              console.error('Async: Could not copy text: ', err);
              return false;
            });

          case 7:
            success = _context.sent;

          case 8:
            return _context.abrupt("return", success);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _copyTextToClipboard.apply(this, arguments);
}

var CopyButton = function CopyButton(_ref) {
  var text = _ref.text,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className;

  var _React$useState = React__default.useState({
    "default": true,
    success: false
  }),
      copyResult = _React$useState[0],
      setCopyResut = _React$useState[1];

  var handleCopyToClipboard = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(e) {
      var noSpaces;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              e.preventDefault();
              e.stopPropagation();
              noSpaces = text ? text.trim() : text;
              _context.t0 = setCopyResut;
              _context.next = 6;
              return copyTextToClipboard(noSpaces);

            case 6:
              _context.t1 = _context.sent;
              _context.t2 = {
                "default": false,
                success: _context.t1
              };
              (0, _context.t0)(_context.t2);
              setTimeout(function () {
                setCopyResut({
                  "default": true,
                  success: false
                });
              }, 1000);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function handleCopyToClipboard(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  return React__default.createElement("a", {
    href: '/#',
    onClick: handleCopyToClipboard,
    className: "side-action text-secondary " + className
  }, copyResult["default"] || !copyResult.success ? React__default.createElement(ReactFontawesome$1.FontAwesomeIcon, {
    icon: icons.faCopy
  }) : React__default.createElement(ReactFontawesome$1.FontAwesomeIcon, {
    icon: icons.faCheck,
    className: 'text-primary-highlight'
  }));
};

var CopyButton$1 = /*#__PURE__*/withClassNameWrapper(CopyButton);

var Trim = function Trim(_ref) {
  var text = _ref.text,
      _ref$dataTestId = _ref.dataTestId,
      dataTestId = _ref$dataTestId === void 0 ? '' : _ref$dataTestId;

  var _React$useState = React__default.useState(false),
      overflow = _React$useState[0],
      setOverflow = _React$useState[1];

  var trimRef = React__default.useRef(document.createElement('span'));
  var hiddenTextRef = React__default.useRef(document.createElement('span'));
  var listener = useCallback(debounce$1(function () {
    if (trimRef.current && hiddenTextRef.current) {
      var diff = hiddenTextRef.current.offsetWidth - trimRef.current.offsetWidth;
      setOverflow(diff > 1);
    }
  }, 300), []);

  var addWindowResizeListener = function addWindowResizeListener() {
    window.addEventListener('resize', listener);
    return function () {
      window.removeEventListener('resize', listener);
    };
  };

  React__default.useEffect(addWindowResizeListener);
  React__default.useEffect(function () {
    listener();
  }, []);
  return React__default.createElement("span", {
    ref: trimRef,
    className: "trim " + (overflow ? 'overflow' : ''),
    "data-testid": dataTestId
  }, React__default.createElement("span", {
    ref: hiddenTextRef,
    className: 'hidden-text-ref'
  }, text), overflow ? React__default.createElement(React__default.Fragment, null, React__default.createElement("span", {
    className: 'left'
  }, React__default.createElement("span", null, String(text).substring(0, Math.floor(text.length / 2)))), React__default.createElement("span", {
    className: 'ellipsis'
  }, "..."), React__default.createElement("span", {
    className: 'right'
  }, React__default.createElement("span", null, String(text).substring(Math.ceil(text.length / 2))))) : React__default.createElement("span", null, text));
};

var Trim$1 = /*#__PURE__*/withClassNameWrapper(Trim);

var TxDetails = function TxDetails(_ref) {
  var title = _ref.title,
      transactions = _ref.transactions,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'tx-details' : _ref$className,
      _ref$isTimedOut = _ref.isTimedOut,
      isTimedOut = _ref$isTimedOut === void 0 ? false : _ref$isTimedOut,
      _ref$shouldRenderDefa = _ref.shouldRenderDefaultCss,
      shouldRenderDefaultCss = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa;
  var generatedClasses = getGeneratedClasses(className, shouldRenderDefaultCss, {
    title: 'mb-0',
    statusTransactions: 'mb-2 mt-1',
    iconSuccess: 'mr-1 text-secondary',
    iconFailed: 'mr-1 text-secondary',
    trimContainer: 'text-nowrap trim-fs-sm mr-3',
    iconPending: 'mr-1 text-secondary fa-spin slow-spin',
    item: 'tx-description d-flex justify-content-start align-items-center'
  });
  var iconSuccessData = {
    icon: icons.faCheck,
    classNames: generatedClasses.iconSuccess
  };
  var iconFailedData = {
    icon: icons.faTimes,
    classNames: generatedClasses.iconSuccess
  };
  var iconPendingData = {
    icon: icons.faCircleNotch,
    classNames: generatedClasses.iconPending
  };
  var iconData = {
    pending: iconPendingData,
    success: iconSuccessData,
    completed: iconSuccessData,
    fail: iconFailedData,
    invalid: iconFailedData,
    timedOut: iconFailedData
  };
  return React__default.createElement(React__default.Fragment, null, title && React__default.createElement("div", {
    className: generatedClasses.title
  }, title), React__default.createElement("div", {
    className: generatedClasses.statusTransactions
  }, transactions.filter(function (tx) {
    return !isServerTransactionPending(tx.status);
  }).length, ' ', "/ ", transactions.length, " transactions processed"), transactions.map(function (_ref2) {
    var hash = _ref2.hash,
        status = _ref2.status;
    var iconSrc = iconData[status];
    return React__default.createElement("div", {
      className: generatedClasses.item,
      key: hash
    }, !isTimedOut && iconSrc != null && React__default.createElement(ReactFontawesome$1.FontAwesomeIcon, {
      icon: iconSrc.icon,
      className: iconSrc.classNames
    }), React__default.createElement("span", {
      className: generatedClasses.trimContainer,
      style: {
        width: '10rem'
      }
    }, React__default.createElement(Trim$1, {
      text: hash
    })), React__default.createElement(CopyButton$1, {
      text: hash
    }), !isServerTransactionPending(status) && React__default.createElement(ExplorerLink$1, {
      page: "/transactions/" + hash,
      className: 'ml-2'
    }));
  }));
};

var TxDetails$1 = /*#__PURE__*/withClassNameWrapper(TxDetails);

var averageTxDurationMs = 6000;
var crossShardRounds = 5;

var TransactionToast = function TransactionToast(_ref) {
  var toastId = _ref.toastId,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? '' : _ref$title,
      _ref$shouldRenderDefa = _ref.shouldRenderDefaultCss,
      shouldRenderDefaultCss = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'transaction-toast' : _ref$className,
      _ref$withTxNonce = _ref.withTxNonce,
      withTxNonce = _ref$withTxNonce === void 0 ? false : _ref$withTxNonce,
      transactions = _ref.transactions,
      status = _ref.status,
      onClose = _ref.onClose,
      startTimeProgress = _ref.startTimeProgress,
      endTimeProgress = _ref.endTimeProgress,
      lifetimeAfterSuccess = _ref.lifetimeAfterSuccess;
  var ref = useRef(null);

  var _useState = useState(true),
      shouldRender = _useState[0],
      setShouldRender = _useState[1];

  var transactionDisplayInfo = useGetTransactionDisplayInfo(toastId);
  var accountShard = useSelector(shardSelector);
  var _transactionDisplayIn = transactionDisplayInfo.errorMessage,
      errorMessage = _transactionDisplayIn === void 0 ? 'Transaction failed' : _transactionDisplayIn,
      _transactionDisplayIn2 = transactionDisplayInfo.timedOutMessage,
      timedOutMessage = _transactionDisplayIn2 === void 0 ? 'Transaction timed out' : _transactionDisplayIn2,
      _transactionDisplayIn3 = transactionDisplayInfo.successMessage,
      successMessage = _transactionDisplayIn3 === void 0 ? 'Transaction successful' : _transactionDisplayIn3,
      _transactionDisplayIn4 = transactionDisplayInfo.processingMessage,
      processingMessage = _transactionDisplayIn4 === void 0 ? 'Processing transaction' : _transactionDisplayIn4;
  var isSameShard = useMemo(function () {
    return transactions.reduce(function (prevTxIsSameShard, _ref2) {
      var receiver = _ref2.receiver,
          data = _ref2.data;
      var receiverAddress = getAddressFromDataField({
        receiver: receiver,
        data: data
      });

      if (receiverAddress == null) {
        return prevTxIsSameShard;
      }

      return prevTxIsSameShard && isCrossShardTransaction({
        receiverAddress: receiverAddress,
        senderShard: accountShard
      });
    }, true);
  }, [transactions, accountShard]);
  var shardAdjustedDuration = isSameShard ? averageTxDurationMs : crossShardRounds * averageTxDurationMs;
  var transactionDuration = (transactionDisplayInfo == null ? void 0 : transactionDisplayInfo.transactionDuration) || shardAdjustedDuration;
  var generatedClasses = getGeneratedClasses(className, shouldRenderDefaultCss, {
    toastFooter: 'mb-0 text-break',
    details: 'media-body flex-grow-1',
    toastContainer: 'w-100 media p-2',
    wrapper: 'toast-visible clickable',
    toastHeader: 'd-flex justify-content-between mb-1',
    iconContainer: 'align-self-center ml-2 mr-2 pr-1',
    title: 'm-0 font-weight-normal text-nowrap text-truncate',
    closeButton: 'close d-flex side-action align-items-center mx-2 outline-0'
  });

  var _useMemo = useMemo(function () {
    var startTime = startTimeProgress || moment$1().unix();
    var endTime = endTimeProgress || moment$1().add(Number(transactionDuration), 'milliseconds').unix();
    return [startTime, endTime];
  }, []),
      startTime = _useMemo[0],
      endTime = _useMemo[1];

  var progress = {
    startTime: startTime,
    endTime: endTime
  };
  var successToastData = {
    id: toastId,
    icon: icons.faCheck,
    expires: 30000,
    hasCloseButton: true,
    title: successMessage,
    iconClassName: 'bg-success'
  };
  var pendingToastData = {
    id: toastId,
    expires: false,
    icon: icons.faHourglass,
    hasCloseButton: false,
    title: processingMessage,
    iconClassName: 'bg-warning'
  };
  var failToastData = {
    id: toastId,
    icon: icons.faTimes,
    title: errorMessage,
    hasCloseButton: true,
    iconClassName: 'bg-danger'
  };
  var timedOutToastData = {
    id: toastId,
    icon: icons.faTimes,
    title: timedOutMessage,
    hasCloseButton: true,
    iconClassName: 'bg-warning'
  };
  var isPending = getIsTransactionPending(status);
  var isTimedOut = getIsTransactionTimedOut(status);
  var toatsOptionsData = {
    signed: pendingToastData,
    sent: pendingToastData,
    pending: pendingToastData,
    success: successToastData,
    completed: successToastData,
    cancelled: failToastData,
    fail: failToastData,
    timedOut: timedOutToastData
  };
  var toastDataState = toatsOptionsData[status];

  var handleDeleteToast = function handleDeleteToast() {
    setShouldRender(false);
    onClose == null ? void 0 : onClose(toastId);
  };

  if (!shouldRender || transactions == null) {
    return null;
  }

  return React__default.createElement(ReactBootstrap$1.Toast, {
    ref: ref,
    className: generatedClasses.wrapper,
    key: toastId
  }, React__default.createElement(Progress$1, {
    key: toastId,
    id: toastId,
    progress: progress,
    expiresIn: lifetimeAfterSuccess,
    done: !isPending || isTimedOut
  }, React__default.createElement("div", {
    className: generatedClasses.toastContainer
  }, React__default.createElement("div", {
    className: generatedClasses.iconContainer
  }, React__default.createElement(IconState$1, {
    iconSize: '2x',
    icon: toastDataState.icon,
    className: toastDataState.iconClassName
  }), withTxNonce && transactions.map(function (tx) {
    return React__default.createElement("p", {
      key: tx.nonce.valueOf()
    }, tx.nonce.valueOf());
  })), React__default.createElement("div", {
    className: generatedClasses.details,
    style: {
      minWidth: 0
    }
  }, React__default.createElement("div", {
    className: generatedClasses.toastHeader
  }, React__default.createElement("h5", {
    className: generatedClasses.title
  }, toastDataState.title), !isPending && React__default.createElement("button", {
    type: 'button',
    className: generatedClasses.closeButton,
    onClick: handleDeleteToast
  }, React__default.createElement(ReactFontawesome$1.FontAwesomeIcon, {
    icon: icons.faTimes,
    size: 'xs'
  }))), React__default.createElement("div", {
    className: generatedClasses.toastFooter
  }, React__default.createElement(TxDetails$1, {
    transactions: transactions,
    title: title,
    isTimedOut: isTimedOut
  }))))));
};

var TransactionToast$1 = /*#__PURE__*/withClassNameWrapper(TransactionToast);

function TransactionsToastList(_ref) {
  var _ref$shouldRenderDefa = _ref.shouldRenderDefaultCss,
      shouldRenderDefaultCss = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa,
      _ref$withTxNonce = _ref.withTxNonce,
      withTxNonce = _ref$withTxNonce === void 0 ? false : _ref$withTxNonce,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'transactions-toast-list' : _ref$className,
      pendingTransactions = _ref.pendingTransactions,
      signedTransactions = _ref.signedTransactions,
      successfulToastLifetime = _ref.successfulToastLifetime;

  var _useState = useState([]),
      toastsIds = _useState[0],
      setToastsIds = _useState[1];

  var pendingTransactionsFromStore = useGetPendingTransactions().pendingTransactions;
  var signedTransactionsFromStore = useGetSignedTransactions().signedTransactions;
  var pendingTransactionsToRender = pendingTransactions || pendingTransactionsFromStore;
  var signedTransactionsToRender = signedTransactions || signedTransactionsFromStore;
  var generatedClasses = getGeneratedClasses(className, shouldRenderDefaultCss, {
    wrapper: 'toast-messages d-flex flex-column align-items-center justify-content-sm-end',
    toast: ''
  });
  var mappedToastsList = toastsIds == null ? void 0 : toastsIds.map(function (toastId) {
    var currentTx = signedTransactionsToRender[toastId];

    if (currentTx == null || (currentTx == null ? void 0 : currentTx.transactions) == null || (currentTx == null ? void 0 : currentTx.status) == null) {
      return null;
    }

    var transactions = currentTx.transactions,
        status = currentTx.status;
    return React__default.createElement(TransactionToast$1, {
      className: className,
      key: toastId,
      transactions: transactions,
      status: status,
      toastId: toastId,
      withTxNonce: withTxNonce,
      lifetimeAfterSuccess: successfulToastLifetime
    });
  });

  var mapPendingSignedTransactions = function mapPendingSignedTransactions() {
    var newToasts = [].concat(toastsIds);

    for (var sessionId in pendingTransactionsToRender) {
      var hasToast = toastsIds.includes(sessionId);

      if (!hasToast) {
        newToasts.push(sessionId);
      }
    }

    setToastsIds(newToasts);
  };

  var fetchSessionStorageToasts = function fetchSessionStorageToasts() {
    var sessionStorageToastsIds = getToastsIdsFromStorage();

    if (sessionStorageToastsIds) {
      var newToasts = [].concat(toastsIds, sessionStorageToastsIds);
      setToastsIds(newToasts);
    }
  };

  var saveSessionStorageToasts = function saveSessionStorageToasts() {
    var shouldSaveLocalToasts = Boolean(toastsIds.length);

    if (!shouldSaveLocalToasts) {
      return;
    }

    setToastsIdsToStorage(toastsIds);
  };

  useEffect(function () {
    fetchSessionStorageToasts();
    return function () {
      saveSessionStorageToasts();
    };
  }, []);
  useEffect(function () {
    mapPendingSignedTransactions();
  }, [pendingTransactionsToRender]);
  return React__default.createElement("div", {
    className: generatedClasses.wrapper
  }, mappedToastsList);
}

var index$6 = /*#__PURE__*/withClassNameWrapper(TransactionsToastList);

var _excluded$1 = ["amount", "usd"];

var UsdValue = function UsdValue(props) {
  var amount = props.amount,
      usd = props.usd,
      dataTestId = _objectWithoutPropertiesLoose(props, _excluded$1);

  var value = "\u2248 $" + getUsdValue({
    amount: amount,
    usd: usd
  });
  return createElement("small", Object.assign({
    className: 'form-text text-secondary mt-0'
  }, dataTestId), "" + amount === '0' ? '= $0' : value);
};

var platform = {};

try {
  platform = /*#__PURE__*/require('platform');
} catch (err) {}

var platform$1 = platform;

var qrcode = {};

try {
  qrcode = /*#__PURE__*/require('qrcode');
} catch (err) {}

var QRCode = qrcode;

var _g$2;

function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }

var SvgLightning = function SvgLightning(props) {
  return /*#__PURE__*/createElement("svg", _extends$3({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 31.114 44.981",
    width: 16,
    height: 16
  }, props), _g$2 || (_g$2 = /*#__PURE__*/createElement("g", {
    fillRule: "evenodd",
    fill: "#fff"
  }, /*#__PURE__*/createElement("path", {
    d: "m20.547 1.001-3.832 17.8H7.054Z"
  }), /*#__PURE__*/createElement("path", {
    d: "m31.41 17.802-7.053 9.379H0l7.054-9.379Z"
  }), /*#__PURE__*/createElement("path", {
    d: "m24.357 26.18-13.493 17.8 3.832-17.8Z"
  }))));
};

function WalletConnectLoginContainer(_ref) {
  var _platform$os, _platform$os2;

  var callbackRoute = _ref.callbackRoute,
      loginButtonText = _ref.loginButtonText,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? 'Maiar Login' : _ref$title,
      _ref$logoutRoute = _ref.logoutRoute,
      logoutRoute = _ref$logoutRoute === void 0 ? '/unlock' : _ref$logoutRoute,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'wallect-connect-login-modal' : _ref$className,
      _ref$lead = _ref.lead,
      lead = _ref$lead === void 0 ? 'Scan the QR code using Maiar' : _ref$lead,
      _ref$shouldRenderDefa = _ref.shouldRenderDefaultCss,
      shouldRenderDefaultCss = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa,
      _ref$wrapContentInsid = _ref.wrapContentInsideModal,
      wrapContentInsideModal = _ref$wrapContentInsid === void 0 ? true : _ref$wrapContentInsid,
      redirectAfterLogin = _ref.redirectAfterLogin,
      token = _ref.token,
      onClose = _ref.onClose;

  var _useWalletConnectLogi = useWalletConnectLogin({
    logoutRoute: logoutRoute,
    callbackRoute: callbackRoute,
    token: token,
    redirectAfterLogin: redirectAfterLogin,
    shouldLoginUser: true
  }),
      initLoginWithWalletConnect = _useWalletConnectLogi[0],
      error = _useWalletConnectLogi[1].error,
      _useWalletConnectLogi2 = _useWalletConnectLogi[2],
      uriDeepLink = _useWalletConnectLogi2.uriDeepLink,
      walletConnectUri = _useWalletConnectLogi2.walletConnectUri;

  var _useState = useState(''),
      qrCodeSvg = _useState[0],
      setQrCodeSvg = _useState[1];

  var isMobileDevice = (platform$1 == null ? void 0 : (_platform$os = platform$1.os) == null ? void 0 : _platform$os.family) === 'iOS' || (platform$1 == null ? void 0 : (_platform$os2 = platform$1.os) == null ? void 0 : _platform$os2.family) === 'Android';
  var generatedClasses = getGeneratedClasses(className, shouldRenderDefaultCss, {
    wrapper: 'btn btn-primary px-sm-4 m-1 mx-sm-3',
    loginText: 'text-left',
    container: 'm-auto login-container',
    card: 'card my-3 text-center',
    cardBody: 'card-body p-4 mx-lg-4',
    qrCodeSvgContainer: 'mx-auto mb-3',
    title: 'mb-3',
    leadText: 'lead mb-0',
    mobileLoginButton: 'btn btn-primary d-inline-flex align-items-center px-4 mt-4',
    mobileLoginButtonIcon: 'mr-2',
    errorMessage: 'text-danger d-flex justify-content-center align-items-center'
  });

  var generateQRCode = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var svg;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (walletConnectUri) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              _context.next = 4;
              return QRCode.toString(walletConnectUri, {
                type: 'svg'
              });

            case 4:
              svg = _context.sent;
              setQrCodeSvg(svg);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function generateQRCode() {
      return _ref2.apply(this, arguments);
    };
  }();

  useEffect(function () {
    generateQRCode();
  }, [walletConnectUri]);
  useEffect(function () {
    initLoginWithWalletConnect();
  }, []);
  var content = React__default.createElement("div", {
    className: generatedClasses.container
  }, React__default.createElement("div", {
    className: generatedClasses.root
  }, React__default.createElement("div", {
    className: generatedClasses.card
  }, React__default.createElement("div", {
    className: generatedClasses.cardBody
  }, React__default.createElement("div", {
    className: generatedClasses.qrCodeSvgContainer,
    dangerouslySetInnerHTML: {
      __html: qrCodeSvg
    },
    style: {
      width: '15rem',
      height: '15rem'
    }
  }), React__default.createElement("h4", {
    className: generatedClasses.title
  }, title), isMobileDevice ? React__default.createElement(React__default.Fragment, null, React__default.createElement("p", {
    className: generatedClasses.leadText
  }, loginButtonText), React__default.createElement("a", {
    id: 'accessWalletBtn',
    "data-testid": 'accessWalletBtn',
    className: generatedClasses.mobileLoginButton,
    href: uriDeepLink || undefined,
    rel: 'noopener noreferrer nofollow',
    target: '_blank'
  }, React__default.createElement(SvgLightning, {
    className: generatedClasses.mobileLoginButtonIcon,
    style: {
      width: '0.9rem',
      height: '0.9rem'
    }
  }), title)) : React__default.createElement("p", {
    className: generatedClasses.leadText
  }, lead), React__default.createElement("div", null, error && React__default.createElement("p", {
    className: generatedClasses.errorMessage
  }, error))))));
  return wrapContentInsideModal ? React__default.createElement(ModalContainer, {
    title: 'Login with Maiar',
    className: className,
    onClose: onClose
  }, content) : content;
}

var WalletConnectLoginContainer$1 = /*#__PURE__*/withClassNameWrapper(WalletConnectLoginContainer);

var WalletConnectLoginButton = function WalletConnectLoginButton(_ref) {
  var children = _ref.children,
      callbackRoute = _ref.callbackRoute,
      onModalOpens = _ref.onModalOpens,
      onModalCloses = _ref.onModalCloses,
      _ref$loginButtonText = _ref.loginButtonText,
      loginButtonText = _ref$loginButtonText === void 0 ? 'Maiar App' : _ref$loginButtonText,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? 'Maiar Login' : _ref$title,
      _ref$logoutRoute = _ref.logoutRoute,
      logoutRoute = _ref$logoutRoute === void 0 ? '/unlock' : _ref$logoutRoute,
      _ref$shouldRenderDefa = _ref.shouldRenderDefaultCss,
      shouldRenderDefaultCss = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa,
      _ref$wrapContentInsid = _ref.wrapContentInsideModal,
      wrapContentInsideModal = _ref$wrapContentInsid === void 0 ? true : _ref$wrapContentInsid,
      _ref$redirectAfterLog = _ref.redirectAfterLogin,
      redirectAfterLogin = _ref$redirectAfterLog === void 0 ? false : _ref$redirectAfterLog,
      buttonClassName = _ref.buttonClassName,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'wallect-connect-login' : _ref$className,
      _ref$lead = _ref.lead,
      lead = _ref$lead === void 0 ? 'Scan the QR code using Maiar' : _ref$lead,
      token = _ref.token,
      _ref$hideButtonWhenMo = _ref.hideButtonWhenModalOpens,
      hideButtonWhenModalOpens = _ref$hideButtonWhenMo === void 0 ? false : _ref$hideButtonWhenMo;

  var _useState = useState(false),
      showLoginModal = _useState[0],
      setShowLoginModal = _useState[1];

  var generatedClasses = getGeneratedClasses(className, shouldRenderDefaultCss, {
    wrapper: "btn btn-primary px-sm-4 m-1 mx-sm-3 " + (buttonClassName != null ? buttonClassName : ''),
    loginText: 'text-left'
  });

  var handleOpenModal = function handleOpenModal() {
    setShowLoginModal(true);
    onModalOpens == null ? void 0 : onModalOpens();
  };

  var handleCloseModal = function handleCloseModal() {
    setShowLoginModal(false);
    onModalCloses == null ? void 0 : onModalCloses();
  };

  var shouldRenderButton = !hideButtonWhenModalOpens || !showLoginModal;
  return React__default.createElement(Fragment, null, shouldRenderButton && React__default.createElement("button", {
    onClick: handleOpenModal,
    className: generatedClasses.wrapper
  }, children || React__default.createElement("span", {
    className: generatedClasses.loginText
  }, loginButtonText)), showLoginModal && React__default.createElement(WalletConnectLoginContainer$1, {
    callbackRoute: callbackRoute,
    loginButtonText: loginButtonText,
    title: title,
    token: token,
    className: className,
    logoutRoute: logoutRoute,
    lead: lead,
    wrapContentInsideModal: wrapContentInsideModal,
    redirectAfterLogin: redirectAfterLogin,
    onClose: handleCloseModal
  }));
};

var WalletConnectLoginButton$1 = /*#__PURE__*/withClassNameWrapper(WalletConnectLoginButton);

var WebWalletLoginButton = function WebWalletLoginButton(_ref) {
  var children = _ref.children,
      token = _ref.token,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'web-wallet-login' : _ref$className,
      callbackRoute = _ref.callbackRoute,
      buttonClassName = _ref.buttonClassName,
      _ref$loginButtonText = _ref.loginButtonText,
      loginButtonText = _ref$loginButtonText === void 0 ? 'Elrond Web Wallet' : _ref$loginButtonText,
      _ref$shouldRenderDefa = _ref.shouldRenderDefaultCss,
      shouldRenderDefaultCss = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa;

  var _useWebWalletLogin = useWebWalletLogin({
    callbackRoute: callbackRoute,
    token: token
  }),
      onInitiateLogin = _useWebWalletLogin[0];

  var classes = getGeneratedClasses(className, shouldRenderDefaultCss, {
    wrapper: "btn btn-primary px-sm-4 m-1 mx-sm-3 " + (buttonClassName != null ? buttonClassName : ''),
    loginText: 'text-left'
  });

  var handleLogin = function handleLogin() {
    onInitiateLogin();
  };

  return React__default.createElement("button", {
    onClick: handleLogin,
    className: classes.wrapper
  }, children || React__default.createElement("span", {
    className: classes.loginText
  }, loginButtonText));
};

var WebWalletLoginButton$1 = /*#__PURE__*/withClassNameWrapper(WebWalletLoginButton);

var UnlockPage = function UnlockPage(_ref) {
  var loginRoute = _ref.loginRoute,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? 'Login' : _ref$title,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'unlock-page' : _ref$className,
      _ref$shouldRenderDefa = _ref.shouldRenderDefaultCss,
      shouldRenderDefaultCss = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa,
      _ref$LedgerLoginButto = _ref.LedgerLoginButtonText,
      LedgerLoginButtonText = _ref$LedgerLoginButto === void 0 ? 'Ledger' : _ref$LedgerLoginButto,
      _ref$description = _ref.description,
      description = _ref$description === void 0 ? 'Pick a login method' : _ref$description,
      _ref$WalletConnectLog = _ref.WalletConnectLoginButtonText,
      WalletConnectLoginButtonText = _ref$WalletConnectLog === void 0 ? 'Maiar' : _ref$WalletConnectLog,
      _ref$ExtensionLoginBu = _ref.ExtensionLoginButtonText,
      ExtensionLoginButtonText = _ref$ExtensionLoginBu === void 0 ? 'Extension' : _ref$ExtensionLoginBu,
      _ref$WebWalletLoginBu = _ref.WebWalletLoginButtonText,
      WebWalletLoginButtonText = _ref$WebWalletLoginBu === void 0 ? 'Web wallet' : _ref$WebWalletLoginBu;
  var generatedClasses = getGeneratedClasses(className, shouldRenderDefaultCss, {
    wrapper: "home d-flex flex-fill align-items-center " + wrapperClassName,
    title: 'mb-4',
    description: 'mb-4',
    cardContainer: 'm-auto',
    card: 'card my-4 text-center',
    cardBody: 'card-body py-4 px-2 px-sm-2 mx-lg-4'
  });

  var _useGetLoginInfo = useGetLoginInfo(),
      isLoggedIn = _useGetLoginInfo.isLoggedIn;

  React__default.useEffect(function () {
    if (isLoggedIn) {
      window.location.href = loginRoute;
    }
  }, [isLoggedIn]);
  return React__default.createElement("div", {
    className: generatedClasses.wrapper
  }, React__default.createElement("div", {
    className: generatedClasses.cardContainer
  }, React__default.createElement("div", {
    className: generatedClasses.card
  }, React__default.createElement("div", {
    className: generatedClasses.cardBody
  }, React__default.createElement("h4", {
    className: generatedClasses.title
  }, title), React__default.createElement("p", {
    className: generatedClasses.description
  }, description), React__default.createElement(ExtensionLoginButton$1, {
    callbackRoute: loginRoute,
    loginButtonText: ExtensionLoginButtonText
  }), React__default.createElement(WebWalletLoginButton$1, {
    callbackRoute: loginRoute,
    loginButtonText: WebWalletLoginButtonText
  }), React__default.createElement(LedgerLoginButton$1, {
    loginButtonText: LedgerLoginButtonText,
    callbackRoute: loginRoute
  }), React__default.createElement(WalletConnectLoginButton$1, {
    callbackRoute: loginRoute,
    loginButtonText: WalletConnectLoginButtonText
  })))));
};

var index$7 = /*#__PURE__*/withClassNameWrapper(UnlockPage);



var index$8 = {
  __proto__: null,
  UnlockPage: index$7
};



var index$9 = {
  __proto__: null,
  ExplorerLink: ExplorerLink$1,
  Denominate: Denominate$1,
  PageState: PageState$1,
  ExtensionLoginButton: ExtensionLoginButton$1,
  LedgerLoginButton: LedgerLoginButton$1,
  LedgerLoginContainer: LedgerLoginContainer$1,
  NotificationModal: NotificationModal,
  SignTransactionsModals: index$5,
  SignWithLedgerModal: SignWithLedgerModal,
  SignWithExtensionModal: SignWithExtensionModal,
  TransactionsToastList: index$6,
  TransactionToast: TransactionToast$1,
  WalletConnectLoginButton: WalletConnectLoginButton$1,
  WalletConnectLoginContainer: WalletConnectLoginContainer$1,
  WebWalletLoginButton: WebWalletLoginButton$1,
  Trim: Trim$1,
  UsdValue: UsdValue,
  ProgressSteps: ProgressSteps,
  DappCorePages: index$8
};

var apiProvider = null;
function initializeApiProvider(networkConfig) {
  var initializationNetworkConfig = networkConfig || networkSelector(store.getState());
  apiProvider = new ApiProvider(initializationNetworkConfig.apiAddress, {
    timeout: Number(initializationNetworkConfig.apiTimeout)
  });
  return apiProvider;
}
function getApiProvider() {
  if (apiProvider == null) {
    return initializeApiProvider();
  } else {
    return apiProvider;
  }
}

var mnemonicWords = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction', 'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge', 'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel', 'base', 'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become', 'beef', 'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit', 'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology', 'bird', 'birth', 'bitter', 'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood', 'blossom', 'blouse', 'blue', 'blur', 'blush', 'board', 'boat', 'body', 'boil', 'bomb', 'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow', 'boss', 'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain', 'brand', 'brass', 'brave', 'bread', 'breeze', 'brick', 'bridge', 'brief', 'bright', 'bring', 'brisk', 'broccoli', 'broken', 'bronze', 'broom', 'brother', 'brown', 'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb', 'bulk', 'bullet', 'bundle', 'bunker', 'burden', 'burger', 'burst', 'bus', 'business', 'busy', 'butter', 'buyer', 'buzz', 'cabbage', 'cabin', 'cable', 'cactus', 'cage', 'cake', 'call', 'calm', 'camera', 'camp', 'can', 'canal', 'cancel', 'candy', 'cannon', 'canoe', 'canvas', 'canyon', 'capable', 'capital', 'captain', 'car', 'carbon', 'card', 'cargo', 'carpet', 'carry', 'cart', 'case', 'cash', 'casino', 'castle', 'casual', 'cat', 'catalog', 'catch', 'category', 'cattle', 'caught', 'cause', 'caution', 'cave', 'ceiling', 'celery', 'cement', 'census', 'century', 'cereal', 'certain', 'chair', 'chalk', 'champion', 'change', 'chaos', 'chapter', 'charge', 'chase', 'chat', 'cheap', 'check', 'cheese', 'chef', 'cherry', 'chest', 'chicken', 'chief', 'child', 'chimney', 'choice', 'choose', 'chronic', 'chuckle', 'chunk', 'churn', 'cigar', 'cinnamon', 'circle', 'citizen', 'city', 'civil', 'claim', 'clap', 'clarify', 'claw', 'clay', 'clean', 'clerk', 'clever', 'click', 'client', 'cliff', 'climb', 'clinic', 'clip', 'clock', 'clog', 'close', 'cloth', 'cloud', 'clown', 'club', 'clump', 'cluster', 'clutch', 'coach', 'coast', 'coconut', 'code', 'coffee', 'coil', 'coin', 'collect', 'color', 'column', 'combine', 'come', 'comfort', 'comic', 'common', 'company', 'concert', 'conduct', 'confirm', 'congress', 'connect', 'consider', 'control', 'convince', 'cook', 'cool', 'copper', 'copy', 'coral', 'core', 'corn', 'correct', 'cost', 'cotton', 'couch', 'country', 'couple', 'course', 'cousin', 'cover', 'coyote', 'crack', 'cradle', 'craft', 'cram', 'crane', 'crash', 'crater', 'crawl', 'crazy', 'cream', 'credit', 'creek', 'crew', 'cricket', 'crime', 'crisp', 'critic', 'crop', 'cross', 'crouch', 'crowd', 'crucial', 'cruel', 'cruise', 'crumble', 'crunch', 'crush', 'cry', 'crystal', 'cube', 'culture', 'cup', 'cupboard', 'curious', 'current', 'curtain', 'curve', 'cushion', 'custom', 'cute', 'cycle', 'dad', 'damage', 'damp', 'dance', 'danger', 'daring', 'dash', 'daughter', 'dawn', 'day', 'deal', 'debate', 'debris', 'decade', 'december', 'decide', 'decline', 'decorate', 'decrease', 'deer', 'defense', 'define', 'defy', 'degree', 'delay', 'deliver', 'demand', 'demise', 'denial', 'dentist', 'deny', 'depart', 'depend', 'deposit', 'depth', 'deputy', 'derive', 'describe', 'desert', 'design', 'desk', 'despair', 'destroy', 'detail', 'detect', 'develop', 'device', 'devote', 'diagram', 'dial', 'diamond', 'diary', 'dice', 'diesel', 'diet', 'differ', 'digital', 'dignity', 'dilemma', 'dinner', 'dinosaur', 'direct', 'dirt', 'disagree', 'discover', 'disease', 'dish', 'dismiss', 'disorder', 'display', 'distance', 'divert', 'divide', 'divorce', 'dizzy', 'doctor', 'document', 'dog', 'doll', 'dolphin', 'domain', 'donate', 'donkey', 'donor', 'door', 'dose', 'double', 'dove', 'draft', 'dragon', 'drama', 'drastic', 'draw', 'dream', 'dress', 'drift', 'drill', 'drink', 'drip', 'drive', 'drop', 'drum', 'dry', 'duck', 'dumb', 'dune', 'during', 'dust', 'dutch', 'duty', 'dwarf', 'dynamic', 'eager', 'eagle', 'early', 'earn', 'earth', 'easily', 'east', 'easy', 'echo', 'ecology', 'economy', 'edge', 'edit', 'educate', 'effort', 'egg', 'eight', 'either', 'elbow', 'elder', 'electric', 'elegant', 'element', 'elephant', 'elevator', 'elite', 'else', 'embark', 'embody', 'embrace', 'emerge', 'emotion', 'employ', 'empower', 'empty', 'enable', 'enact', 'end', 'endless', 'endorse', 'enemy', 'energy', 'enforce', 'engage', 'engine', 'enhance', 'enjoy', 'enlist', 'enough', 'enrich', 'enroll', 'ensure', 'enter', 'entire', 'entry', 'envelope', 'episode', 'equal', 'equip', 'era', 'erase', 'erode', 'erosion', 'error', 'erupt', 'escape', 'essay', 'essence', 'estate', 'eternal', 'ethics', 'evidence', 'evil', 'evoke', 'evolve', 'exact', 'example', 'excess', 'exchange', 'excite', 'exclude', 'excuse', 'execute', 'exercise', 'exhaust', 'exhibit', 'exile', 'exist', 'exit', 'exotic', 'expand', 'expect', 'expire', 'explain', 'expose', 'express', 'extend', 'extra', 'eye', 'eyebrow', 'fabric', 'face', 'faculty', 'fade', 'faint', 'faith', 'fall', 'false', 'fame', 'family', 'famous', 'fan', 'fancy', 'fantasy', 'farm', 'fashion', 'fat', 'fatal', 'father', 'fatigue', 'fault', 'favorite', 'feature', 'february', 'federal', 'fee', 'feed', 'feel', 'female', 'fence', 'festival', 'fetch', 'fever', 'few', 'fiber', 'fiction', 'field', 'figure', 'file', 'film', 'filter', 'final', 'find', 'fine', 'finger', 'finish', 'fire', 'firm', 'first', 'fiscal', 'fish', 'fit', 'fitness', 'fix', 'flag', 'flame', 'flash', 'flat', 'flavor', 'flee', 'flight', 'flip', 'float', 'flock', 'floor', 'flower', 'fluid', 'flush', 'fly', 'foam', 'focus', 'fog', 'foil', 'fold', 'follow', 'food', 'foot', 'force', 'forest', 'forget', 'fork', 'fortune', 'forum', 'forward', 'fossil', 'foster', 'found', 'fox', 'fragile', 'frame', 'frequent', 'fresh', 'friend', 'fringe', 'frog', 'front', 'frost', 'frown', 'frozen', 'fruit', 'fuel', 'fun', 'funny', 'furnace', 'fury', 'future', 'gadget', 'gain', 'galaxy', 'gallery', 'game', 'gap', 'garage', 'garbage', 'garden', 'garlic', 'garment', 'gas', 'gasp', 'gate', 'gather', 'gauge', 'gaze', 'general', 'genius', 'genre', 'gentle', 'genuine', 'gesture', 'ghost', 'giant', 'gift', 'giggle', 'ginger', 'giraffe', 'girl', 'give', 'glad', 'glance', 'glare', 'glass', 'glide', 'glimpse', 'globe', 'gloom', 'glory', 'glove', 'glow', 'glue', 'goat', 'goddess', 'gold', 'good', 'goose', 'gorilla', 'gospel', 'gossip', 'govern', 'gown', 'grab', 'grace', 'grain', 'grant', 'grape', 'grass', 'gravity', 'great', 'green', 'grid', 'grief', 'grit', 'grocery', 'group', 'grow', 'grunt', 'guard', 'guess', 'guide', 'guilt', 'guitar', 'gun', 'gym', 'habit', 'hair', 'half', 'hammer', 'hamster', 'hand', 'happy', 'harbor', 'hard', 'harsh', 'harvest', 'hat', 'have', 'hawk', 'hazard', 'head', 'health', 'heart', 'heavy', 'hedgehog', 'height', 'hello', 'helmet', 'help', 'hen', 'hero', 'hidden', 'high', 'hill', 'hint', 'hip', 'hire', 'history', 'hobby', 'hockey', 'hold', 'hole', 'holiday', 'hollow', 'home', 'honey', 'hood', 'hope', 'horn', 'horror', 'horse', 'hospital', 'host', 'hotel', 'hour', 'hover', 'hub', 'huge', 'human', 'humble', 'humor', 'hundred', 'hungry', 'hunt', 'hurdle', 'hurry', 'hurt', 'husband', 'hybrid', 'ice', 'icon', 'idea', 'identify', 'idle', 'ignore', 'ill', 'illegal', 'illness', 'image', 'imitate', 'immense', 'immune', 'impact', 'impose', 'improve', 'impulse', 'inch', 'include', 'income', 'increase', 'index', 'indicate', 'indoor', 'industry', 'infant', 'inflict', 'inform', 'inhale', 'inherit', 'initial', 'inject', 'injury', 'inmate', 'inner', 'innocent', 'input', 'inquiry', 'insane', 'insect', 'inside', 'inspire', 'install', 'intact', 'interest', 'into', 'invest', 'invite', 'involve', 'iron', 'island', 'isolate', 'issue', 'item', 'ivory', 'jacket', 'jaguar', 'jar', 'jazz', 'jealous', 'jeans', 'jelly', 'jewel', 'job', 'join', 'joke', 'journey', 'joy', 'judge', 'juice', 'jump', 'jungle', 'junior', 'junk', 'just', 'kangaroo', 'keen', 'keep', 'ketchup', 'key', 'kick', 'kid', 'kidney', 'kind', 'kingdom', 'kiss', 'kit', 'kitchen', 'kite', 'kitten', 'kiwi', 'knee', 'knife', 'knock', 'know', 'lab', 'label', 'labor', 'ladder', 'lady', 'lake', 'lamp', 'language', 'laptop', 'large', 'later', 'latin', 'laugh', 'laundry', 'lava', 'law', 'lawn', 'lawsuit', 'layer', 'lazy', 'leader', 'leaf', 'learn', 'leave', 'lecture', 'left', 'leg', 'legal', 'legend', 'leisure', 'lemon', 'lend', 'length', 'lens', 'leopard', 'lesson', 'letter', 'level', 'liar', 'liberty', 'library', 'license', 'life', 'lift', 'light', 'like', 'limb', 'limit', 'link', 'lion', 'liquid', 'list', 'little', 'live', 'lizard', 'load', 'loan', 'lobster', 'local', 'lock', 'logic', 'lonely', 'long', 'loop', 'lottery', 'loud', 'lounge', 'love', 'loyal', 'lucky', 'luggage', 'lumber', 'lunar', 'lunch', 'luxury', 'lyrics', 'machine', 'mad', 'magic', 'magnet', 'maid', 'mail', 'main', 'major', 'make', 'mammal', 'man', 'manage', 'mandate', 'mango', 'mansion', 'manual', 'maple', 'marble', 'march', 'margin', 'marine', 'market', 'marriage', 'mask', 'mass', 'master', 'match', 'material', 'math', 'matrix', 'matter', 'maximum', 'maze', 'meadow', 'mean', 'measure', 'meat', 'mechanic', 'medal', 'media', 'melody', 'melt', 'member', 'memory', 'mention', 'menu', 'mercy', 'merge', 'merit', 'merry', 'mesh', 'message', 'metal', 'method', 'middle', 'midnight', 'milk', 'million', 'mimic', 'mind', 'minimum', 'minor', 'minute', 'miracle', 'mirror', 'misery', 'miss', 'mistake', 'mix', 'mixed', 'mixture', 'mobile', 'model', 'modify', 'mom', 'moment', 'monitor', 'monkey', 'monster', 'month', 'moon', 'moral', 'more', 'morning', 'mosquito', 'mother', 'motion', 'motor', 'mountain', 'mouse', 'move', 'movie', 'much', 'muffin', 'mule', 'multiply', 'muscle', 'museum', 'mushroom', 'music', 'must', 'mutual', 'myself', 'mystery', 'myth', 'naive', 'name', 'napkin', 'narrow', 'nasty', 'nation', 'nature', 'near', 'neck', 'need', 'negative', 'neglect', 'neither', 'nephew', 'nerve', 'nest', 'net', 'network', 'neutral', 'never', 'news', 'next', 'nice', 'night', 'noble', 'noise', 'nominee', 'noodle', 'normal', 'north', 'nose', 'notable', 'note', 'nothing', 'notice', 'novel', 'now', 'nuclear', 'number', 'nurse', 'nut', 'oak', 'obey', 'object', 'oblige', 'obscure', 'observe', 'obtain', 'obvious', 'occur', 'ocean', 'october', 'odor', 'off', 'offer', 'office', 'often', 'oil', 'okay', 'old', 'olive', 'olympic', 'omit', 'once', 'one', 'onion', 'online', 'only', 'open', 'opera', 'opinion', 'oppose', 'option', 'orange', 'orbit', 'orchard', 'order', 'ordinary', 'organ', 'orient', 'original', 'orphan', 'ostrich', 'other', 'outdoor', 'outer', 'output', 'outside', 'oval', 'oven', 'over', 'own', 'owner', 'oxygen', 'oyster', 'ozone', 'pact', 'paddle', 'page', 'pair', 'palace', 'palm', 'panda', 'panel', 'panic', 'panther', 'paper', 'parade', 'parent', 'park', 'parrot', 'party', 'pass', 'patch', 'path', 'patient', 'patrol', 'pattern', 'pause', 'pave', 'payment', 'peace', 'peanut', 'pear', 'peasant', 'pelican', 'pen', 'penalty', 'pencil', 'people', 'pepper', 'perfect', 'permit', 'person', 'pet', 'phone', 'photo', 'phrase', 'physical', 'piano', 'picnic', 'picture', 'piece', 'pig', 'pigeon', 'pill', 'pilot', 'pink', 'pioneer', 'pipe', 'pistol', 'pitch', 'pizza', 'place', 'planet', 'plastic', 'plate', 'play', 'please', 'pledge', 'pluck', 'plug', 'plunge', 'poem', 'poet', 'point', 'polar', 'pole', 'police', 'pond', 'pony', 'pool', 'popular', 'portion', 'position', 'possible', 'post', 'potato', 'pottery', 'poverty', 'powder', 'power', 'practice', 'praise', 'predict', 'prefer', 'prepare', 'present', 'pretty', 'prevent', 'price', 'pride', 'primary', 'print', 'priority', 'prison', 'private', 'prize', 'problem', 'process', 'produce', 'profit', 'program', 'project', 'promote', 'proof', 'property', 'prosper', 'protect', 'proud', 'provide', 'public', 'pudding', 'pull', 'pulp', 'pulse', 'pumpkin', 'punch', 'pupil', 'puppy', 'purchase', 'purity', 'purpose', 'purse', 'push', 'put', 'puzzle', 'pyramid', 'quality', 'quantum', 'quarter', 'question', 'quick', 'quit', 'quiz', 'quote', 'rabbit', 'raccoon', 'race', 'rack', 'radar', 'radio', 'rail', 'rain', 'raise', 'rally', 'ramp', 'ranch', 'random', 'range', 'rapid', 'rare', 'rate', 'rather', 'raven', 'raw', 'razor', 'ready', 'real', 'reason', 'rebel', 'rebuild', 'recall', 'receive', 'recipe', 'record', 'recycle', 'reduce', 'reflect', 'reform', 'refuse', 'region', 'regret', 'regular', 'reject', 'relax', 'release', 'relief', 'rely', 'remain', 'remember', 'remind', 'remove', 'render', 'renew', 'rent', 'reopen', 'repair', 'repeat', 'replace', 'report', 'require', 'rescue', 'resemble', 'resist', 'resource', 'response', 'result', 'retire', 'retreat', 'return', 'reunion', 'reveal', 'review', 'reward', 'rhythm', 'rib', 'ribbon', 'rice', 'rich', 'ride', 'ridge', 'rifle', 'right', 'rigid', 'ring', 'riot', 'ripple', 'risk', 'ritual', 'rival', 'river', 'road', 'roast', 'robot', 'robust', 'rocket', 'romance', 'roof', 'rookie', 'room', 'rose', 'rotate', 'rough', 'round', 'route', 'royal', 'rubber', 'rude', 'rug', 'rule', 'run', 'runway', 'rural', 'sad', 'saddle', 'sadness', 'safe', 'sail', 'salad', 'salmon', 'salon', 'salt', 'salute', 'same', 'sample', 'sand', 'satisfy', 'satoshi', 'sauce', 'sausage', 'save', 'say', 'scale', 'scan', 'scare', 'scatter', 'scene', 'scheme', 'school', 'science', 'scissors', 'scorpion', 'scout', 'scrap', 'screen', 'script', 'scrub', 'sea', 'search', 'season', 'seat', 'second', 'secret', 'section', 'security', 'seed', 'seek', 'segment', 'select', 'sell', 'seminar', 'senior', 'sense', 'sentence', 'series', 'service', 'session', 'settle', 'setup', 'seven', 'shadow', 'shaft', 'shallow', 'share', 'shed', 'shell', 'sheriff', 'shield', 'shift', 'shine', 'ship', 'shiver', 'shock', 'shoe', 'shoot', 'shop', 'short', 'shoulder', 'shove', 'shrimp', 'shrug', 'shuffle', 'shy', 'sibling', 'sick', 'side', 'siege', 'sight', 'sign', 'silent', 'silk', 'silly', 'silver', 'similar', 'simple', 'since', 'sing', 'siren', 'sister', 'situate', 'six', 'size', 'skate', 'sketch', 'ski', 'skill', 'skin', 'skirt', 'skull', 'slab', 'slam', 'sleep', 'slender', 'slice', 'slide', 'slight', 'slim', 'slogan', 'slot', 'slow', 'slush', 'small', 'smart', 'smile', 'smoke', 'smooth', 'snack', 'snake', 'snap', 'sniff', 'snow', 'soap', 'soccer', 'social', 'sock', 'soda', 'soft', 'solar', 'soldier', 'solid', 'solution', 'solve', 'someone', 'song', 'soon', 'sorry', 'sort', 'soul', 'sound', 'soup', 'source', 'south', 'space', 'spare', 'spatial', 'spawn', 'speak', 'special', 'speed', 'spell', 'spend', 'sphere', 'spice', 'spider', 'spike', 'spin', 'spirit', 'split', 'spoil', 'sponsor', 'spoon', 'sport', 'spot', 'spray', 'spread', 'spring', 'spy', 'square', 'squeeze', 'squirrel', 'stable', 'stadium', 'staff', 'stage', 'stairs', 'stamp', 'stand', 'start', 'state', 'stay', 'steak', 'steel', 'stem', 'step', 'stereo', 'stick', 'still', 'sting', 'stock', 'stomach', 'stone', 'stool', 'story', 'stove', 'strategy', 'street', 'strike', 'strong', 'struggle', 'student', 'stuff', 'stumble', 'style', 'subject', 'submit', 'subway', 'success', 'such', 'sudden', 'suffer', 'sugar', 'suggest', 'suit', 'summer', 'sun', 'sunny', 'sunset', 'super', 'supply', 'supreme', 'sure', 'surface', 'surge', 'surprise', 'surround', 'survey', 'suspect', 'sustain', 'swallow', 'swamp', 'swap', 'swarm', 'swear', 'sweet', 'swift', 'swim', 'swing', 'switch', 'sword', 'symbol', 'symptom', 'syrup', 'system', 'table', 'tackle', 'tag', 'tail', 'talent', 'talk', 'tank', 'tape', 'target', 'task', 'taste', 'tattoo', 'taxi', 'teach', 'team', 'tell', 'ten', 'tenant', 'tennis', 'tent', 'term', 'test', 'text', 'thank', 'that', 'theme', 'then', 'theory', 'there', 'they', 'thing', 'this', 'thought', 'three', 'thrive', 'throw', 'thumb', 'thunder', 'ticket', 'tide', 'tiger', 'tilt', 'timber', 'time', 'tiny', 'tip', 'tired', 'tissue', 'title', 'toast', 'tobacco', 'today', 'toddler', 'toe', 'together', 'toilet', 'token', 'tomato', 'tomorrow', 'tone', 'tongue', 'tonight', 'tool', 'tooth', 'top', 'topic', 'topple', 'torch', 'tornado', 'tortoise', 'toss', 'total', 'tourist', 'toward', 'tower', 'town', 'toy', 'track', 'trade', 'traffic', 'tragic', 'train', 'transfer', 'trap', 'trash', 'travel', 'tray', 'treat', 'tree', 'trend', 'trial', 'tribe', 'trick', 'trigger', 'trim', 'trip', 'trophy', 'trouble', 'truck', 'true', 'truly', 'trumpet', 'trust', 'truth', 'try', 'tube', 'tuition', 'tumble', 'tuna', 'tunnel', 'turkey', 'turn', 'turtle', 'twelve', 'twenty', 'twice', 'twin', 'twist', 'two', 'type', 'typical', 'ugly', 'umbrella', 'unable', 'unaware', 'uncle', 'uncover', 'under', 'undo', 'unfair', 'unfold', 'unhappy', 'uniform', 'unique', 'unit', 'universe', 'unknown', 'unlock', 'until', 'unusual', 'unveil', 'update', 'upgrade', 'uphold', 'upon', 'upper', 'upset', 'urban', 'urge', 'usage', 'use', 'used', 'useful', 'useless', 'usual', 'utility', 'vacant', 'vacuum', 'vague', 'valid', 'valley', 'valve', 'van', 'vanish', 'vapor', 'various', 'vast', 'vault', 'vehicle', 'velvet', 'vendor', 'venture', 'venue', 'verb', 'verify', 'version', 'very', 'vessel', 'veteran', 'viable', 'vibrant', 'vicious', 'victory', 'video', 'view', 'village', 'vintage', 'violin', 'virtual', 'virus', 'visa', 'visit', 'visual', 'vital', 'vivid', 'vocal', 'voice', 'void', 'volcano', 'volume', 'vote', 'voyage', 'wage', 'wagon', 'wait', 'walk', 'wall', 'walnut', 'want', 'warfare', 'warm', 'warrior', 'wash', 'wasp', 'waste', 'water', 'wave', 'way', 'wealth', 'weapon', 'wear', 'weasel', 'weather', 'web', 'wedding', 'weekend', 'weird', 'welcome', 'west', 'wet', 'whale', 'what', 'wheat', 'wheel', 'when', 'where', 'whip', 'whisper', 'wide', 'width', 'wife', 'wild', 'will', 'win', 'window', 'wine', 'wing', 'wink', 'winner', 'winter', 'wire', 'wisdom', 'wise', 'wish', 'witness', 'wolf', 'woman', 'wonder', 'wood', 'wool', 'word', 'work', 'world', 'worry', 'worth', 'wrap', 'wreck', 'wrestle', 'wrist', 'write', 'wrong', 'yard', 'year', 'yellow', 'you', 'young', 'youth', 'zebra', 'zero', 'zone', 'zoo'];
function getMnemonicWords() {
  return mnemonicWords;
}

export { AppInitializer, AuthenticatedRoutesWrapper, DappProvider, index$9 as DappUI, ESDTTransferTypes, EnvironmentsEnum, LoginMethodsEnum, NotificationTypesEnum, TransactionBatchStatusesEnum, TransactionServerStatusesEnum, TransactionTypesEnum, TypesOfSmartContractCallsEnum, addressIsValid, index$3 as apiCalls, buildUrlParams$1 as buildUrlParams, builtCallbackUrl, calculateFeeLimit, completedServerTransactionsStates, index as constants, decodeBase64, decodePart, denominate, encodeToBase64, failBatchTransactionsStates, failServerTransactionsStates, fallbackNetworkConfigurations, getAccount, getAccountBalance, getAccountProvider, getAccountProviderType, getAddress, getAddressFromDataField, getApiProvider, getChainID, getEgldLabel, getExternalProvider, getGeneratedClasses, getIdentifierType, getIsLoggedIn, getIsProviderEqualTo, getIsTransactionCompleted, getIsTransactionFailed, getIsTransactionPending, getIsTransactionSuccessful, getIsTransactionTimedOut, getLatestNonce, getMnemonicWords, getNetworkConfig, getProxyProvider, getShardOfAddress, getTokenFromData, getUsdValue, isBatchTransactionFailed, isBatchTransactionPending, isBatchTransactionSuccessful, isBatchTransactionTimedOut, isContract, isSelfESDTContract, isServerTransactionFailed, isServerTransactionPending, isServerTransactionSuccessful, isStringBase64, isTokenTransfer, logarithmicRest, index$1 as loginServices, loginWithExternalProvider, logout, index$4 as models, nominate, parseMultiEsdtTransferData, parseTransactionAfterSigning, pendingBatchTransactionsStates, pendingServerTransactionsStatuses, pipe, refreshAccount, sendTransactions, setNonce, signMessage, storage$1 as storage, stringIsFloat, stringIsInteger, successBatchTransactionsStates, successServerTransactionsStates, switchTrue, timedOutBatchTransactionsStates, index$2 as transactionServices, useGetAccountInfo, useGetAccountProvider, useGetLoginInfo, useGetNetworkConfig, useGetNotification, useGetPendingTransactions, useGetSignTransactionsError, useGetSignedTransactions, useGetTokenDetails, useGetTransactionDisplayInfo, useIdleTimer, useParseMultiEsdtTransferData, useParseSignedTransactions, useSignTransactions, useSignTransactionsWithLedger, useUpdateEffect, wrapperClassName };
//# sourceMappingURL=dapp-core.esm.js.map
