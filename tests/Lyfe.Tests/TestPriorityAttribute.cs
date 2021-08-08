using System;

namespace Lyfe.Tests
{
    /// <summary>
    /// https://docs.microsoft.com/en-us/dotnet/core/testing/order-unit-tests?pivots=xunit#order-by-custom-attribute
    /// </summary>
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
    public class TestPriorityAttribute : Attribute
    {
        public int Priority { get; }
        public TestPriorityAttribute(int priority) => Priority = priority;
    }
}
